'use strict';

function generateKeyDefault(request){
  var response = request.response;

  if(!response){
    return;
  }

  if(response.isBoom){
    return response.output.statusCode;
  }

  return request.response.statusCode;
}

function adaptation(server, options, done){

  // TODO: valdation
  var generateKey = options.generateKey || generateKeyDefault;

  function adaptResponse(request, reply){
    var key = generateKey(request);

    var routeConfig = request.route.settings.plugins.adaptation;

    if(!key || !routeConfig){
      reply.continue();
      return;
    }

    var adapt = routeConfig[key];

    if(!adapt){
      reply.continue();
      return;
    }

    adapt(request, reply);
  }

  server.ext('onPreResponse', adaptResponse);

  done();
}

adaptation.attributes = {
  pkg: require('./package.json')
};

module.exports = {
  register: adaptation
};
