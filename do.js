/*

Requires the following dependencies:
 
 - NPM Modules: 
   - do-wrapper
   - superagent
 - a secret named "api-token" with a valid Digital Ocean API V2 token
 
*/

var DigitalOcean = require('do-wrapper');
var SuperAgent = require('superagent');


module.exports = (ctx, cb) => {
  var api = new DigitalOcean(ctx.secrets["api-token"], 100)
  
  params = ctx.body.text.split(/\s+/)
  switch(params[0]) {
    case 'info': 
      working(cb)
      info(cb, api, ctx) 
      break;
    case 'list': 
      working(cb)
      list(cb, api, ctx) 
      break;
    case 'shutdown': 
      working(cb)
      doAction(cb, api, ctx, 'shutdown', params[1]) 
      break;
    case 'start': 
      working(cb)
      doAction(cb, api, ctx, 'power_on', params[1]) 
      break;
    default: 
      usage(cb)
  }
}

function info(callback, api, ctx) {
  api.account().then((data) => {
    var accountInfo = JSON.stringify(data.body, undefined, 2)
    SuperAgent.post(ctx.body.response_url)
    .send({ text: `ACCOUNT INFORMATION:\n${accountInfo}`, response_type: 'ephemeral' })
    .end();
  });
}

function list(callback, api, ctx) {
  api.dropletsGetAll({"tag_name": []}).then((data) => {
    var dropletsList = JSON.stringify(data.body, undefined, 2)
    SuperAgent.post(ctx.body.response_url)
    .send({ text: `DROPLETS LIST:\n${dropletsList}`, response_type: 'ephemeral' })
    .end();
  });
}

function doAction(callback, api, ctx, action, dropletID) {
  api.dropletsRequestAction(dropletID, {"type": action}).then((data) => {
    SuperAgent.post(ctx.body.response_url)
    .send({ text: `status: ${data.body.action.status}`, response_type: 'ephemeral' })
    .end();
  }).catch((err) => {
    SuperAgent.post(ctx.body.response_url)
    .send({ text: `ERROR: ${err}`, response_type: 'ephemeral' })
    .end();
  });
}

function working(callback) {
  callback(null, { text: `:hourglass: Working...`})
}

function usage(callback) {
  var message = "Usage: /wt do command [args]. Where command is one of the following:\n\tinfo:\tshows account information\n\tlist:\tlists all droplets\n\tstop dropletid:\tgracefully shutdowns the droplet identified by the droplet id passed as a parameter\n\tstart dropletid:\tboots the droplet identified by the droplet id passed as a parameter\n"
  callback(null, { text: `Unknown command.\n${message}` });
}
