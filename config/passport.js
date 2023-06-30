const passport = require('passport');
const User = require('./database')

const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;

const  opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'jwt secret';

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    const user = await User.findOne({_id : jwt_payload.id}).exec()

    if(user) {
      return done(null,user)
    }
    else {
      return done(null, false)
    }
  }
  catch(err){
    return done(err, false)
  }
}));