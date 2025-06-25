# Simple Demo Application Deployment Guide

This guides covers the actions necessary to deploy a simple demo application that is representative of a typical
web application architecture used in a production environment.

## End-State of this Guide

1. **Frontend Website** 
   * Hosted on a custom domain by GitHub Pages (e.g `https://mycustomdomain.com`)
   * Content Distribution Handled by Cloudflare CDN
   * Simple "Authentication Use Case" containing Homepage, Login Form, and Account Page
2. **Backend Origin Server** 
   * AWS API Gateway secured with API Keys that are validated with Serverless AWS Lambda Authorizer 
   * AWS API Gateway Resource to capture `POST` requests to `/api/echo` and handle them with an AWS Lambda Echo Function
3. **Content Distribution Network**
   * Hosted by Cloudflare handling all requests to custom domain
   * Cloudflare Edge Worker to proxy requests to `https://{{mycustomdomain.com}}/api/*` to AWS API Gateway
   * Cloudflare Rules to inject a custom header (e.g. `my-api-auth`) containing the AWS API Gateway API Key

## Prerequisites

To complete this guide, you will need the following:
1. **Amazon Web Services (AWS) Account**
   * With permissions to create an S3 Bucket and upload files
   * With permissions to use Cloudformation to deploy AWS Lambda, AWS API Gateway, and AWS IAM Role Resources
2. **Custom Domain**
    * Registered on any registrar that allows for editing the Nameservers of the Domain
3. **GitHub Account**
   * Configured with SSH Key uploaded to the Account
   * Not already configured to used GitHub pages on a repo matching your GitHub username
4. **Cloudflare Account**
   * Setup on Cloudflare's Free Plan
5. **Properly Configured Computer**
   * Linux or Mac operating system
   * `git` installed whether from binary or through `homebrew`

## Decisions you'll need to make before Starting

There are three pieces of data that you will need to keep consistent through this guide, and you should define them now
before continuing. These are:
1. Base URL for your website (i.e. your Custom Domain)
2. The name of the header to use for your API Key
3. The value of the API Key that will be included in your header

This guide was developed and tested using the following values:
* **GUIDE_BASE_URL:**  `https://ignotusanalytics.com`
* **GUIDE_API_KEY_HEADER:** `dwn-api-auth`
* **GUIDE_API_KEY:** `1qaz@WSX3edc$RFV`

> [!CAUTION]
> The above variable names prefixed with `GUIDE_` are names that only appear within this guide and are not the names
> of the variables within the code files.  These variables will be used within the guide to reference these key pieces
> of information needed for the deployment.

As you work through this guide, you will have the opportunity to custom the names of resources deployed into AWS, but you
must take care to use them consistently throughout the guide.

---
## Simple Demo Application Deployment

### Part 1:  Deploy Demo App Backend Resources on AWS

#### Part Inputs:
1. **File:** authorizer-handler.zip
2. **File:** echo-handler.zip
3. **File:** cloudformation-install-demo-app-backend-resources.yaml

#### Part Outputs:
1. **Data:** Base URL of the AWS API Gateway
2. **Result:** Full URL of the AWS API Gateway Resource to validate the resources were deployed successfully

#### Steps:
1. Log into the [AWS Console](https://console.aws.amazon.com)
2. Navigate to [S3](https://console.aws.amazon.com/s3/home)
3. Create S3 Bucket
    * [AWS S3 Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html])
    * The only recommended change to the default is to `disable` the `Bucket Key`

> [!WARNING]
> Take note of the bucket name.  You will need it in following steps.

4. Upload the following files from the `/application-deployment-guide/resources-backend` directory of this repository
   * authorizer-handler.zip
   * echo-handler.zip
   * cloudformation-install-demo-app-backend-resources.yaml
5. In a new browser tab, navigate to [CloudFormation](https://console.aws.amazon.com/cloudformation/home)
6. Create a Stack (with new resources)
7. Return to your S3 Browser Tab
    * Click on your bucket name
    * Click on the cloudformation `.yaml` file
    * Copy the Object URL
8. Return to your Cloudformation Browser Tab
9. Copy the Object URL of the Cloudformation `.yaml` into the `Amazon S3 URL` field
10. Click `Next`

> [!Warning]
> The Cloudformation Template is set up with several customizable parameters. Take note of the sub-bullets in the
> step.

11. Fill out the required parameters for the template. Parameter explanations follow:
    * `Stack Name`
      * This should be something unique but also relatively indicative the resources to be deployed.
      * Consider using `darwinium-demo-app`
    * `API Keys`
      * This is where you can provide a comma-separated list of API Keys
      * The need to be at least 12 characters long
      * This is the value you decided on for `GUIDE_API_KEY`
    * `AuthorizerCodeKey`
      * This is the name of the file (without the .zip) that contains the authorizer logic
      * If you didn't edit the file names, it will be `authorizer-handler`
    * `AuthorizerTokenSource`
      * This is the name of the header you decided on for `GUIDE_API_KEY_HEADER`
      * The template is set up to use `dwn-api-auth` by default
    * `EchoCodeKey`
      * Similar to the `AuthorizerCodeKey`, this is the name of the file that contains the echo logic
      * If you didn't edit the file names, it will be `echo-handler`
    * `LambdaCodeBucket`
      * This is the name of the S3 Bucket you created to house the `.zip` and `.yaml` files
    * `StageName`
        * You can keep this set as `dev` but you could customize it if you'd like. Must be all one word.

> [!Warning]
> Make sure the LambdaCodeBucket is the name of the bucket... NOT the bucket url

12. Click `Next`
13. No changes are needed to the optional Stack Options
14. Scroll to the bottom of the screen and check the `I acknowledge...` box
15. Click `Next`
16. Click `Submit`

> [!NOTE]
> The Cloudformation Template will now run and deploy the backend resources.

17. Once the Cloudformation Template is complete, click on the `Outputs` tab of the right panel
    * Here you will find the key information you'll need in Phase 3 of the Guide:
      * `ApiBaseUrl` the base URL (minus the resource string `/api/echo`)
      * `AuthorizedApiKeys` the API keys you set in the template parameters
      * `ApiKeyHeader` the header you set in the template parameters
    * You'll also see:
      * `ApiTestUrl` the full URL you can use to make a Postman `POST` request to validate the deployment

### Part 2: Deploy Demo App Frontend Resources to GitHub Pages

#### Part Inputs:
1. **Data:** Your custom domain url that is needed to complete Step 18
2. **Files:** The file contents located within the `/application-deployment-guide/resources-frontend` directory of this repository

#### Part Outputs:
1. **Data:** DNS Records created at Custom Domain Registrar
2. **Result:** Fully Formed GitHub Pages repository set to host repository contents at Custom Domain

#### Steps:

> [!WARNING]
> The following steps that involve git commands in the terminal assume you're using Linux or MacOS.
> For Windows, please refer to appropriate Windows git command references available on the internet.

> [!NOTE]
> Steps 1-17 are based on the instructions found at the [GitHub Pages Marketing Site](https://pages.github.com/)

1. Log into [GitHub](https://github.com)
2. Create a new `Public` repository with the name `{{username}}.github.io` where you replace the `{{username}}` with your username
    * Do not add a `README` file
    * Do not add a `.gitignore` file
    * Do not add a `license` file
3. Open a terminal on your computer
4. Navigate to the directory where you'd like to house your repository directory. For example the `Documents` folder
    ```shell
   cd 
   cd Documents
    ```
5. Return to GitHub Browser tab
6. Navigate to repository `Code` tab
7. Click on the green `Code` dropdown button
8. Copy the `SSH` clone link
9. Return to your terminal and run the following code

> [!WARNING] 
> Be sure to swap out the `{{username}}` text in the command below

    ```shell
   git clone git@github.com:{{username}}/{{username}}.github.io.git
    ```
10. Open your file explore
11. Navigate to the `/application-deployment-guide/resources-frontend` directory of this repository
12. Copy the contents of the directory

> [!WARNING]
> Be sure to copy the contents and not the directory itself. 

13. Navigate back to our GitHub pages directory and paste the copied contents into the root of the repo
14. Add the files to git repo by running the following command
    ```shell
    git add -all
    ```
15. Commit the files
    ```shell
    git commit -m "Initialization Commit"
    ```
16. Push the files to your repository
    ```shell
    git push -u origin main
    ```
17. Open a new browser tab and navigate to `https://{{username}}.github.io`
18. Complete the steps in GitHub Pages Documentation to "[Manage a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)"

> [!NOTE]
> These instructions state to create an ALIAS or ANAME record however a CNAME record with the same configuration works as well

> [!NOTE]
> As part of the setup for a custom domain, GitHub will auto commit a CNAME file in the repo so you'll need to retrieve the latest.

19. Return to your terminal and run the following git command to get the latest of the repository

    ```shell
    git pull origin master
    ```

### Part 3: Configure Cloudflare to distribute content for Demo App

#### Part Inputs:
1. **Data:** Your custom domain (e.g. `mycustomdomain.com`)

#### Part Outputs:
1. **Result:** Cloudflare CDN handling all requests for the demo application

#### Steps:
1. Login to [Cloudflare](https://www.cloudflare.com/)
2. Navigate to your Account Home
    * Alternatively, if this is your first time logging in, you may be prompted to add a domain
3. Click `Add a Domain` button
4. Enter your Custom Domain and set to `Quick Scan for DNS Records`
5. Click `Continue`
6. Select `Free` plan
7. Validate that your A, AAAA, and CNAME Records from your existing DNS have been detected for import

> [!WARNING]
> If they are not detected for import, you can add them manually using the `Add record` button.

8. Click `Continue to activation`
9. Open a new browser tab and navigate to the Domain Registrar for your Custom Domain
10. Update your Domain's Nameservers to the Cloudflare servers according to the instructions provided
11. Click `Continue`
12. Once Custom Domain's Nameservers are up-to-date click `Check nameservers now` button
    * It may take some time for the change to propagate through the Global DNS system
13. Once nameservers are up-to-date and checked in cloudflare, open a terminal
14. Run the following command

```shell
    curl -I {{mycustomdomain.com}}
```

> [!WARNING]
> Be sure to swap out the `{{mycustomdomain.com}}` text in the command below

15. Look at the output for `CF-Ray:` and/or `CF-Cache-Status:` lines which indicate Cloudflare is successfully fronting the demo app

### Part 4: Configure Cloudflare to proxy requests to `/api/*` to Demo App AWS API Gateway

#### Part Inputs:
1. **File:** cloudflare-worker-proxy-to-backend.js
2. **Data:** GUIDE_BASE_URL (Available in Outputs of AWS Cloudformation Stack)
3. **Data:** GUIDE_API_KEY_HEADER (Available in Outputs of AWS Cloudformation Stack)
4. **Data:** GUIDE_API_KEY (Available in Outputs of AWS Cloudformation Stack)

#### Part Outputs:
1. **Result:** Completed Demo Application Deployment with Frontend, Backend, and Cloudflare in place.

#### Steps:
1. Login to [Cloudflare](https://www.cloudflare.com/)
2. Navigate to your `Account Home`
3. Select `Compute (Workers)` from the left menu
4. Click `Create` button
5. Select `Start with Hello World`
6. Name worker `proxy-frontend-api-requests-to-backed-api`
7. Click `Deploy`

> [!WARNING]
> Cloudflare is super confusing, but this will deploy a simple hello world worker that we will then edit and redeploy

8. Click `Edit code`
9. Copy and Paste in contents of `proxy-to-backend-api.js` file located in `/application-deployment-guide/resources-cloudflare` directory of this repository
10. Click `Deploy`
11. Navigate to back to the main dashboard of the worker by clicking on the `<- proxy-frontend-api-requests-to-backed-api` link at the top left
12. Click `Settings`
13. Select `Variables and Secrets` from the left menu
14. Click `+ Add` Link
15. Create a variable with the following settings:
    * **Type:** `Text`
    * **Variable name:** `API_AUTH_HEADER_NAME`
    * **Value:** `{{GUIDE_API_KEY_HEADER}}`
16. Click `Deploy`
17. Click `+ Add` Link
18. Create a variable with the following settings:
    * **Type:** `Text`
    * **Variable name:** `API_BASE_URL`
    * **Value:** `{{ApiBaseUrl}}` (Available in the Outputs of the AWs Cloudformation Stack)
19. Click `Deploy`
20. Navigate to your `Account Home`
21. Click on your Custom Domain
22. Select `Rules` in the left menu
23. Click `+ Create rule` button
24. Select `Request Header Transform Rule` from the drop-down menu
25. Create the rule with the following settings:
    * **Rule Name:** Add backend-api-key to /api/* requests
    * **If incoming requests match:** Custom filter expression
      * **Field:** URI Path
      * **Operator:** wildcard
      * **Value:** `/api/*`
    * **Then:**
      * Set Static
      * **Header Name:** `{{GUIDE_API_KEY_HEADER}}`
      * **Value:** `{{GUIDE_API_KEY}}`
    * **Place at**
      * **Select Order:** First

> [!WARNING]
> Be sure to swap out the `{{GUIDE_API_KEY_HEADER}}` and `{{GUIDE_API_KEY_HEADER}}` appropriately

26. Click `Deploy`
    
> [!WARNING]
> Be sure to verify the rule is `active` in the rules list. If it is not, use the ellipsis dropdown to `enable`

> [!NOTE]
> This rule will be your main point of security for your backend api. When not using your demo app, it is recommended that you disable the rule.

27. Select `Workers Routes` from Left Menu
28. Click `Add Route` button
29. Configure route with the following settings:
    * **Route:** `{{mycustomdomain.com}}/api/*`
    * **Worker:** `proxy-frontend-api-requests-to-backed-api`

> [!WARNING]
> Be sure to swap out the `{{mycustomdomain.com}}` appropriately

30. Click `Save`

> [!TIP] CONGRATULATIONS!!! The Demo Application Resources have been deployed and should be ready to use.

## Next Steps

You can now navigate to your custom domain and use the Demo Application's basic authentication user experience. This website
is intended to be very simplistic and offer just enough network events to deploy the Darwinium Journey resources for
experimentation and learning on the platform.

Check out the [Darwinium Journey Guide README](darwinium-journey-guide/README.md) for further guidance.