FORMAT: 1A

# nohu

# Group user

### GET /users{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + users (array[user])

### /users/{id}

+ Parameter

    + id: 1 (number) - user_id

### GET

+ Response 200 (application/json)
    + Attributes (base)
        + user (user)


### PUT
        
+ Response 200 (application/json)
    + Attributes (base)
        + user (user)
        

### GET /users/{id}/questions{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + questions (array[question])
        

### GET /users/{id}/answers{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + answers (array[answer])
        

### GET /user/{id}/comments{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + comments (array[comment])
        

### GET /user/{id}/favorite{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + questions (array[question])
        

### GET /user/{id}/inbox

+ Response 200 (application/json)
    + Attributes (base)
        + inbox (array[inbox])
        

### GET /user/{id}/inbox/unread

+ Response 200 (application/json)
    + Attributes (base)
        + inbox (array[inbox])



# Group question

### GET /questions{?tag,sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + questions (array[question])
        

### POST /questions

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)
        

## /questions/{id}

+ Parameter

    + id: 1 (number) - question_id

### GET

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)
        

### PUT

+ Response 200 (application/json)


### DELETE

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)

### GET /questions/{id}/answers{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + answers (array[answer])
        

### POST /questions/{id}/answers

+ Response 200 (application/json)
    + Attributes (base)
        + answer (answer)

        
### GET /questions/{id}/comments{order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + comments (array[comment])
        

### POST /questions/{id}/comments

+ Response 200 (application/json)
    + Attributes (base)
        + comment (comment)
        

### POST /questions/{id}/votes

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)
        

### POST /questions/{id}/favorite

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)
        

# Group answer

### GET /answers{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + answers (array[answer])
        

## /answers/{id}

### GET

+ Response 200 (applicaion/json)
    + Attributes (base)
        + answer (answer)

        
### PUT

+ Response 200 (application/json)
    + Attributes (base)
        + answer (answer)
        

### DELETE

+ Response 200 (application/json)

### POST /answers/{id}/accept

+ Response 200 (application/json)
    + Attributes (base)
        + answer (answer)
        

### GET /answers/{id}/comments{order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + answers (array[answer])
        

### POST /answers/{id}/comments

+ Response 200 (application/json)
    + Attributes (base)
        + answer (answer)
        

### POST /answers/{id}/vote

+ Response 200 (application/json)
    + Attributes (base)
        + answer(answer)
        

### GET /answers/{id}/question

+ Response 200 (application/json)
    + Attributes (base)
        + question (question)
        

# Group comment

### GET /comments{?sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + comments (array[comment])


## /comments/{id}

### GET

+ Response 200 (application/json)
    + Attributes (base)
        + comment (comment)


### PUT

+ Response 200 (application/json)
    + Attributes (base)
        + comment (comment)

### DELETE

+ Response 200 (application/json)


### POST /comments/{id}/votes

+ Response 200 (application/json)
    + Attributes (base)
        + comment (comment)


# Group search

### GET /search{?intitle,body,answer,comment,sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + posts (array[post])


### GET /similar{?id,sort,order,page,page_size}

+ Response 200 (application/json)
    + Attributes (base)
        + questions (array[question])


# Group auth

### POST /auth/login

+ Response 200 (application/json)
    + Attributes (base)
        + tokens
            + access_token: 1232312314232 (string)
            + expire_in: 3600 (number) - seconds
            + refresh_token: sfjsaflksdjfl (string)

### GET /auth/logout

+ Response 200 (application/json)


### POST /auth/signup

+ Response 200 (application/json)
    + Attributes (base)
        + tokens
            + access_token: 1232312314232 (string)
            + expire_in: 3600 (number) - seconds
            + refresh_token: sfjsaflksdjfl (string)

### POST /auth/refresh_token

+ Response 200 (application/json)
    + Attributes (base)
        + tokens
            + access_token: 1232312314232 (string)
            + expire_in: 3600 (number) - seconds
            + refresh_token: sfjsaflksdjfl (string)

                        
# Data Structures

## base (object)
+ status: 200 (number)
+ message: message (string)

## user (object)
+ uesr_id: 123456 (number)
+ username: spacelan (string)
+ email: spacelan@example.com (string)
+ avater: http://www.example.com/avater/1 (string)
+ display_name: spacelan (string)
+ reputation: 2333 (number)
+ accept_rate: 40 (number)
+ user_type: registed (string)
+ tags (tags)
+ signature: i love spacelan (string)
+ introduction: i love spacelan (string)
+ create_date: 1431879819 (number)
+ last_modified_date: 1431879819 (number)
+ last_access_date: 1431879819 (number)

## shallow_user (object)
+ uesr_id: 123456 (number)
+ user_type: registed (string)
+ reputation: 233 (number)
+ accept_rate: 40 (number)
+ avater: http://www.example.com/avater/1 (string)
+ display_name: spacelan (string)

## tags (array)
+ teeth (string)
+ eye (string)

## comment (object)
+ body: i love spacelan (string)
+ comment_id: 23423 (number)
+ create_date: 1431879819 (number)
+ owner (shallow_user)
+ reply_to_user (shallow_user)
+ relay_to
    + type: question (string) - question or answer or comment
    + id: 123213 (number)

## question (object)
+ tags (tags)
+ owner (shallow_user)
+ question_id: 123243 (number)
+ create_date: 1431879819 (number)
+ last_edit_date: 1431879819 (number)
+ last_editor (shallow_user)
+ last_activity_date: 1431879819 (number)
+ view_count: 10 (number)
+ down_vote_count: 2 (number)
+ up_vote_count: 2 (number)
+ favorite_count: 2 (number)
+ vote: 0 (number)
+ accept_answer_id: 12312 (number)
+ title: who am i (string)
+ body: who am i (string)
+ comments (object)
    + count: 123 (number)
    + ids (array)
        + 123456 (number)
        + 232323 (number)
+ answers (object)
    + count: 123 (number)
    + ids (array)
        + 123456 (number)
        + 232323 (number)
+ favorited: fasle (string) - private
+ upvoted: false (string) - private
+ downvoted: fasle (string) - private

## answer (object)
+ answer_id: 123145 (number)
+ question_id: 123123 (number)
+ owner (shallow_user)
+ create_date: 1431879819 (number)
+ last_edit_date: 1431879819 (number)
+ last_editor (shallow_user)
+ last_edit_reason why (string)
+ last_activity_date: 1431879819 (number)
+ is_accepted: false (string)
+ up_vote_count: 1 (number)
+ down_vote_count: 0 (number)
+ vote: 1 (number)
+ is_accepted: false (string)
+ body: who am i (string)
+ comments (array)
    + count: 123 (number)
    + ids (array)
        + 123456 (number)
        + 232323 (number)
+ upvoted: false (string) - private
+ downvoted: false (string) - private

## post (object)
+ post_id: 3214 (number)
+ post_type: question (string)
+ vote: 12 (number)
+ title: i love spacelan (string)
+ body: i love spacelan (string)
+ create_date: 1431879819 (number)
+ last_activity_date: 1431879819 (number)
+ last_edit_date: 1431879819 (number)

## inbox (object)
+ title: i love spacelan (string)
+ body: i love spaclan (string)
+ create_date: 1431879819 (number)
+ is_unread: false (string)
+ type: new answer (string)
+ answer_id: 134234 (number)
+ question_id: 1231 (number)
+ comment_id: 12312 (number)




















