require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const OAuth2Strategy = require("passport-oauth2");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// passport configuration for google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
            googleId: profile.id,
          });
          return done(null, { user, isNewUser: true });
        } else {
          return done(null, { user, isNewUser: false });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// passport configuration for LinkedIn
passport.use(
  "linkedin",
  new OAuth2Strategy(
    {
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/auth/linkedin/callback",
      scope: ["openid", "profile", "email"],
      state: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const response = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        console.log("access-token", accessToken);

        const linkedinUser = response.data;

        let userData = await User.findOne({ email: linkedinUser.email });

        if (!userData) {
          userData = new User({
            linkedinId: linkedinUser.id,
            name: linkedinUser.localizedFirstName,
            email: linkedinUser.email,
          });
          return done(null, { userData, isNewUser: true });
        } else {
          return done(null, { userData, isNewUser: false });
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, { user: data.user, isNewUser: data.isNewUser });
});

passport.deserializeUser((data, done) => {
  done(null, data);
});
