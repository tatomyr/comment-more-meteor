// Include the body-parser NPM package using the Meteor.npmRequire method we
// get from the meteorhacks:npm package.
var bodyParser = Meteor.npmRequire( 'body-parser' );

// Define our middleware using the Picker.middleware() method.
Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

// Define our routes.
Picker.route( '/api/get/comments/:lastDateTime', function( params, req, res, next ) {
  // Headers - CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");

  // Now we have access to request.body!
  console.log( req.body );

  res.end( JSON.stringify( {"hello": "Helloo",'b':'c'} ) );
  //res.json({"a": "b"});
});
