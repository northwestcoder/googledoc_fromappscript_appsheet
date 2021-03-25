	# googledoc_fromappscript_TRIGGERED

A triggerable google script example that reads the appsheet.com api and generates a google doc using the data retrieved, with support for filtering

## Trigger Setup

- This example uses the same appsheet app as the parent example in this repo. 
- In this second, slightly more advanced example we have provided support for
	- filtering for data in the rest API call
	- config a trigger for google app script, so that it executes when a change is made to the google sheet (change is made by appsheet)
- We assume you know how to set up a google app script and a trigger from a google sheet, e.g. [read here](https://developers.google.com/apps-script/overview) but the short list of tasks is shown below

## Steps to use

- Copy the app below using appsheet.com
- make sure you enable AppSheet Rest API support and take note of your app ID and rest api key.
- Open the spreadsheet called "Requests"
- Go to the "Tools" menu and choose "Script Editor"
- You are creating a new google app script project
- Download the files in this very repo, and then add them to this new app script project. Give the project a meaningful name
- Configure constants.gs to match your appsheet.com application, at a minimum what we are talking about to reproduce this example:
	- In constants.gs, edit the APIKEY to your new key from the previous step
	- In constants.gs, edit the APPID to match your new ID from your newly copied app
- Add a new trigger so that any change to the "Requests" google sheet triggers the function trigger()
- Test

_There are some comments in code which may assist as well_

This example is married up to this [publicly available app](https://www.appsheet.com/samples/Companion-app-for-a-Google-App-Script-Example?appGuidString=2ada15da-4677-4aa2-ac27-7ca67b28cf65) running on appsheet.com. You need to make a copy of this app first, it will not work as-is (because the app is marked as a public example so cannot be modified, and it also has the Rest API feature disabled)
