# slash-do
A webstack.io task that connects slack to the digitalocean api 

USAGE: 

 - Add the Slash Webtask app to your slack organization.
 - Create a webtask from your slash organization:
   
   # /wt make do

 - Edit the webtask and paste the contents of the do.js file in this repository.

 - Create a token in the DigitalOcean admin panel and add it as a secret named "api-token" to the webtask.

 - Add the npm modules "superagent" and "do-wrapper as dependencies in the webtask editor.
 
 - You're ready to go. Enjoy!
