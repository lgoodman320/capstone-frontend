let APIUrl = "http://localhost:3001";

// handle if we're running on heroku
if (window.location.host.indexOf(".herokuapp.com") !== -1) {
    APIUrl = "https://lgoodman320-blog-backend.herokuapp.com";
}

export default APIUrl;
