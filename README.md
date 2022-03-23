# Tasks

/api/v1/signup {name,email,password,photo} response user and http Cookies
/api/v1/login {email,password} response http Cookies
/api/v1/logout
/api/v1/getuser response details of logged in user
/api/v1/password/update {old password,new password} response http Cookies
/api/v1/update/user {name,email,password,photo} response user and http Cookies

/api/v1/admin/users {requires admin authentication based on request token either in cookies or in headers as bearer token} response details of all users

/api/v1/manager/users {checks for manager role} response name of normal users 
