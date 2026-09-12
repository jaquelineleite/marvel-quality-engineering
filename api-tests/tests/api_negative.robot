*** Settings ***
Documentation    Negative and error-contract tests for Marvel Developer GraphQL API.
Library          ../libraries/marvel_api_client.py
Library          Collections

Test Tags        api    graphql    negative


*** Variables ***
${INVALID_SYNTAX_QUERY}    query { user { pk username }
${UNKNOWN_FIELD_QUERY}     query { user { pk campoQueNaoExiste } }
${INVALID_TYPE_QUERY}      query($first: Int!) { user { projects(first: $first) { edges { cursor } } } }


*** Test Cases ***
NEG-01 Invalid GraphQL Syntax Is Rejected
    [Documentation]    Validates parser behavior for a syntactically invalid GraphQL query.
    [Tags]    p1    syntax

    ${response}=    Authenticated GraphQL Request    ${INVALID_SYNTAX_QUERY}

    Should Be Equal As Integers    ${response.status_code}    400

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    errors
    Dictionary Should Not Contain Key    ${body}    data

    ${errors}=    Get From Dictionary    ${body}    errors
    Should Not Be Empty    ${errors}

    ${first_error}=    Get From List    ${errors}    0

    Dictionary Should Contain Key    ${first_error}    message
    Dictionary Should Contain Key    ${first_error}    locations

    ${message}=    Get From Dictionary    ${first_error}    message
    Should Contain    ${message}    Syntax Error
    Should Contain    ${message}    Expected Name


NEG-02 Unknown GraphQL Field Is Rejected
    [Documentation]    Validates schema validation when a nonexistent field is requested.
    [Tags]    p1    schema

    ${response}=    Authenticated GraphQL Request    ${UNKNOWN_FIELD_QUERY}

    Should Be Equal As Integers    ${response.status_code}    400

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    errors
    Dictionary Should Not Contain Key    ${body}    data

    ${errors}=    Get From Dictionary    ${body}    errors
    ${first_error}=    Get From List    ${errors}    0

    Dictionary Should Contain Key    ${first_error}    message
    Dictionary Should Contain Key    ${first_error}    locations

    ${message}=    Get From Dictionary    ${first_error}    message

    Should Contain    ${message}    Cannot query field
    Should Contain    ${message}    campoQueNaoExiste
    Should Contain    ${message}    UserNode


NEG-03 Invalid Variable Type Is Rejected
    [Documentation]    Validates error handling when a GraphQL variable receives an incompatible value.
    [Tags]    p1    variables

    &{variables}=    Create Dictionary    first=abc

    ${response}=    Authenticated GraphQL Request
    ...    ${INVALID_TYPE_QUERY}
    ...    ${variables}

    Should Be Equal As Integers    ${response.status_code}    400

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    errors
    Dictionary Should Not Contain Key    ${body}    data

    ${errors}=    Get From Dictionary    ${body}    errors
    Should Not Be Empty    ${errors}

    ${first_error}=    Get From List    ${errors}    0
    ${message}=    Get From Dictionary    ${first_error}    message

    Should Not Be Empty    ${message}
    Should Match Regexp    ${message}    (?i).*(convert|type|integer|int).*


NEG-06 GraphQL Error Response Follows Base Contract
    [Documentation]    Validates the common error-response contract without assuming optional fields are always present.
    [Tags]    contract    p1

    ${response}=    Authenticated GraphQL Request    ${UNKNOWN_FIELD_QUERY}
    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    errors

    ${errors}=    Get From Dictionary    ${body}    errors

    Should Be True    isinstance($errors, list)
    Should Not Be Empty    ${errors}

    FOR    ${error}    IN    @{errors}
        Dictionary Should Contain Key    ${error}    message

        ${message}=    Get From Dictionary    ${error}    message
        Should Be True    isinstance($message, str)
        Should Not Be Empty    ${message}
    END

    IF    'extensions' in $body
        ${extensions}=    Get From Dictionary    ${body}    extensions
        Should Be True    isinstance($extensions, dict)
    END
