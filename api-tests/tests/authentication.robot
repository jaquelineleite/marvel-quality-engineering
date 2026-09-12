*** Settings ***
Documentation    Authentication tests for Marvel Developer GraphQL API.
Library          ../libraries/marvel_api_client.py
Library          Collections

Test Tags        api    authentication


*** Variables ***
${USER_QUERY}    query { user { pk username } }


*** Test Cases ***
AUTH-01 Valid Token Allows Authenticated User Query
    [Documentation]    Validates authenticated access and essential user response data.
    [Tags]    smoke    positive    p0

    ${response}=    Authenticated GraphQL Request    ${USER_QUERY}

    Should Be Equal As Integers    ${response.status_code}    200

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    data
    Dictionary Should Not Contain Key    ${body}    errors

    ${data}=    Get From Dictionary    ${body}    data
    ${user}=    Get From Dictionary    ${data}    user

    Dictionary Should Contain Key    ${user}    pk
    Dictionary Should Contain Key    ${user}    username

    ${pk}=    Get From Dictionary    ${user}    pk
    ${username}=    Get From Dictionary    ${user}    username

    Should Be True    ${pk} > 0
    Should Not Be Empty    ${username}


AUTH-02 Request Without Token Uses Limited Public Schema
    [Documentation]    Validates the real unauthenticated behavior exposed by the API.
    [Tags]    negative    security    p0

    ${response}=    Unauthenticated GraphQL Request    ${USER_QUERY}

    Should Be Equal As Integers    ${response.status_code}    400

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    info
    Dictionary Should Contain Key    ${body}    errors

    ${info}=    Get From Dictionary    ${body}    info
    ${first_info}=    Get From List    ${info}    0
    ${info_message}=    Get From Dictionary    ${first_info}    message

    Should Contain    ${info_message}    unauthenticated
    Should Contain    ${info_message}    limited schema

    ${errors}=    Get From Dictionary    ${body}    errors
    ${first_error}=    Get From List    ${errors}    0
    ${error_message}=    Get From Dictionary    ${first_error}    message

    Should Contain    ${error_message}    Cannot query field
    Should Contain    ${error_message}    user


AUTH-03 Invalid Token Is Rejected
    [Documentation]    Validates rejection and error contract for an invalid OAuth2 token.
    [Tags]    negative    security    p1

    ${response}=    Invalid Token GraphQL Request    ${USER_QUERY}

    Should Be Equal As Integers    ${response.status_code}    401

    ${body}=    Call Method    ${response}    json

    Dictionary Should Contain Key    ${body}    errors

    ${errors}=    Get From Dictionary    ${body}    errors
    ${first_error}=    Get From List    ${errors}    0
    ${error_message}=    Get From Dictionary    ${first_error}    message

    Should Be Equal
    ...    ${error_message}
    ...    OAuth2 token expired or invalid
