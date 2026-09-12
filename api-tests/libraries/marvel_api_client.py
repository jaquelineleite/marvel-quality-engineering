import os
from pathlib import Path

import requests
from dotenv import load_dotenv
from robot.api.deco import keyword, library


ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")


@library(scope="SUITE", auto_keywords=False)
class MarvelApiClient:
    def __init__(self):
        self.api_url = os.getenv(
            "MARVEL_API_URL",
            "https://api.marvelapp.com/graphql/",
        )
        self.token = os.getenv("MARVEL_API_TOKEN")

        self.session = requests.Session()
        self.session.headers.update(
            {
                "Content-Type": "application/json",
            }
        )

    def _post(self, query, headers=None, variables=None):
        payload = {"query": query}

        if variables is not None:
            payload["variables"] = variables

        return self.session.post(
            self.api_url,
            json=payload,
            headers=headers or {},
            timeout=15,
        )

    @keyword("Authenticated GraphQL Request")
    def authenticated_graphql_request(self, query, variables=None):
        if not self.token:
            raise AssertionError(
                "MARVEL_API_TOKEN is not configured in .env"
            )

        headers = {
            "Authorization": f"Bearer {self.token}",
        }

        return self._post(
            query=query,
            headers=headers,
            variables=variables,
        )

    @keyword("Unauthenticated GraphQL Request")
    def unauthenticated_graphql_request(self, query, variables=None):
        return self._post(
            query=query,
            variables=variables,
        )

    @keyword("Invalid Token GraphQL Request")
    def invalid_token_graphql_request(self, query, variables=None):
        headers = {
            "Authorization": "Bearer invalid-token-for-negative-test",
        }

        return self._post(
            query=query,
            headers=headers,
            variables=variables,
        )
