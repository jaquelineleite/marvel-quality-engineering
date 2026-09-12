import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const graphqlErrors = new Rate('graphql_errors');

const apiUrl = __ENV.MARVEL_API_URL;
const token = __ENV.MARVEL_API_TOKEN;

export const options = {
  vus: 1,
  iterations: 3,

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000'],
    graphql_errors: ['rate==0'],
    checks: ['rate>0.99'],
  },
};

export function setup() {
  if (!apiUrl) {
    throw new Error('MARVEL_API_URL is not configured');
  }

  if (!token) {
    throw new Error('MARVEL_API_TOKEN is not configured');
  }
}

export default function () {
  const payload = JSON.stringify({
    query: 'query { user { pk username } }',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    tags: {
      endpoint: 'graphql',
      test_type: 'smoke',
    },
  };

  const response = http.post(apiUrl, payload, params);

  let body = null;

  try {
    body = response.json();
  } catch (error) {
    graphqlErrors.add(true);

    check(response, {
      'response body is valid JSON': () => false,
    });

    return;
  }

  const hasGraphqlErrors =
    Array.isArray(body.errors) && body.errors.length > 0;

  graphqlErrors.add(hasGraphqlErrors);

  check(response, {
    'HTTP status is 200': (res) => res.status === 200,
    'response contains data': () =>
      body !== null && body.data !== undefined,
    'response has no GraphQL errors': () =>
      !hasGraphqlErrors,
    'user object is returned': () =>
      body?.data?.user !== null &&
      body?.data?.user !== undefined,
    'user pk is valid': () =>
      Number(body?.data?.user?.pk) > 0,
    'username is not empty': () =>
      typeof body?.data?.user?.username === 'string' &&
      body.data.user.username.trim().length > 0,
  });
}
