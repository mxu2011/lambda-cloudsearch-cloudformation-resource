# How to publish your local deployments to the Serverless Framework Dashboard?
- Replace <ADD_ACCESS_KEY_HERE> in devcontainer.env file with the Serverless access key which is hosted in the Secretes Manager in AWS vaisala-viewlinc-tools account. 

# How to generate JWT token?
### 1. Update the following varaibles in cognito_jwt.sh script with your own pool and account
- EMAIL
- PASSWORD
- USER_POOL_ID
- CLIENT_ID
### 2. Change false to true and execute the script for step 1
- Assign the MFA code recived from your email to the variable MFA_CODE
- Assign the session token recived from step 1 to the variable SESSION_TOKEN
### 3. Change step 1 to false and change step 2 to true and execute the script again to get JWT token
### 4. Change step 2 to false for next run