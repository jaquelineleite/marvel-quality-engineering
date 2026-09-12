*** Settings ***
Documentation    Functional and structural tests for Marvel Developer GraphQL API.
Library          ../libraries/marvel_api_client.py
Library          Collections

Test Tags        api    graphql


*** Variables ***
${PROJECTS_QUERY}    query { user { projects(first: 2) { pageInfo { hasNextPage endCursor } edges { cursor node { pk name isArchived createdAt prototypeUrl } } } } }


*** Test Cases ***
API-01 Projects Query Returns Successfully
    [Documentation]    Validates successful authenticated access to the projects collection.
    [Tags]    smoke    positive    p1

    ${response}=    Authenticated GraphQL Request    ${PROJECTS_QUERY}

    Should Be Equal As Integers    ${response.status_code}    200

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    data
    Dictionary Should Not Contain Key    ${body}    errors


API-02 Projects Response Has Expected Structure
    [Documentation]    Validates the structural contract of the projects GraphQL response.
    [Tags]    contract    p1

    ${response}=    Authenticated GraphQL Request    ${PROJECTS_QUERY}
    ${body}=    Call Method    ${response}    json

    ${data}=    Get From Dictionary    ${body}    data
    Dictionary Should Contain Key    ${data}    user

    ${user}=    Get From Dictionary    ${data}    user
    Dictionary Should Contain Key    ${user}    projects

    ${projects}=    Get From Dictionary    ${user}    projects

    Dictionary Should Contain Key    ${projects}    pageInfo
    Dictionary Should Contain Key    ${projects}    edges

    ${edges}=    Get From Dictionary    ${projects}    edges
    Should Be True    isinstance($edges, list)


API-03 Pagination Metadata Is Consistent
    [Documentation]    Validates pageInfo fields and consistency for empty or populated collections.
    [Tags]    pagination    contract    p1

    ${response}=    Authenticated GraphQL Request    ${PROJECTS_QUERY}
    ${body}=    Call Method    ${response}    json

    ${data}=    Get From Dictionary    ${body}    data
    ${user}=    Get From Dictionary    ${data}    user
    ${projects}=    Get From Dictionary    ${user}    projects
    ${page_info}=    Get From Dictionary    ${projects}    pageInfo
    ${edges}=    Get From Dictionary    ${projects}    edges

    Dictionary Should Contain Key    ${page_info}    hasNextPage
    Dictionary Should Contain Key    ${page_info}    endCursor

    ${has_next_page}=    Get From Dictionary    ${page_info}    hasNextPage
    ${end_cursor}=    Get From Dictionary    ${page_info}    endCursor

    Should Be True    isinstance($has_next_page, bool)
    Should Be True    $end_cursor is None or isinstance($end_cursor, str)

    ${count}=    Get Length    ${edges}

    IF    ${count} == 0
        Should Be Equal    ${has_next_page}    ${False}
        Should Be Equal    ${end_cursor}    ${None}
    END


API-04 Project Items Follow Expected Contract When Present
    [Documentation]    Validates project fields dynamically without requiring fixed test data.
    [Tags]    contract    regression    p1

    ${response}=    Authenticated GraphQL Request    ${PROJECTS_QUERY}
    ${body}=    Call Method    ${response}    json

    ${data}=    Get From Dictionary    ${body}    data
    ${user}=    Get From Dictionary    ${data}    user
    ${projects}=    Get From Dictionary    ${user}    projects
    ${edges}=    Get From Dictionary    ${projects}    edges

    ${count}=    Get Length    ${edges}

    IF    ${count} > 0
        FOR    ${edge}    IN    @{edges}
            Dictionary Should Contain Key    ${edge}    cursor
            Dictionary Should Contain Key    ${edge}    node

            ${node}=    Get From Dictionary    ${edge}    node

            Dictionary Should Contain Key    ${node}    pk
            Dictionary Should Contain Key    ${node}    name
            Dictionary Should Contain Key    ${node}    isArchived
            Dictionary Should Contain Key    ${node}    createdAt
            Dictionary Should Contain Key    ${node}    prototypeUrl
        END
    ELSE
        Log    No projects available. Item-level contract validation was not applicable for this execution.
    END


API-05 Rate Limit Metadata Is Present And Valid
    [Documentation]    Validates operational rate-limit metadata returned by authenticated GraphQL requests.
    [Tags]    observability    contract    p2

    ${response}=    Authenticated GraphQL Request    ${PROJECTS_QUERY}
    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    extensions

    ${extensions}=    Get From Dictionary    ${body}    extensions
    Dictionary Should Contain Key    ${extensions}    ratelimit

    ${rate_limit}=    Get From Dictionary    ${extensions}    ratelimit

    Dictionary Should Contain Key    ${rate_limit}    window_reset
    Dictionary Should Contain Key    ${rate_limit}    cost
    Dictionary Should Contain Key    ${rate_limit}    remaining

    ${window_reset}=    Get From Dictionary    ${rate_limit}    window_reset
    ${cost}=    Get From Dictionary    ${rate_limit}    cost
    ${remaining}=    Get From Dictionary    ${rate_limit}    remaining

    Should Be True    isinstance($cost, int)
    Should Be True    isinstance($remaining, int)
    Should Be True    ${cost} > 0
    Should Be True    ${remaining} >= 0
    Should Not Be Empty    ${window_reset}
    Should Contain    ${window_reset}    T
