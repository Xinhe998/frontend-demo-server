define({ "api": [
  {
    "type": "post",
    "url": "/users/register",
    "title": "register",
    "name": "register",
    "group": "User",
    "version": "0.1.0",
    "permission": [
      {
        "name": "none"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Email",
            "description": "<p>會員Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Password",
            "description": "<p>會員密碼</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "Name",
            "description": "<p>會員名稱</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const data = {\n  \"Email\": \"xxx@gmail.com\",\n  \"Password\": \"xxxxxx\",\n  \"Name\": \"Demo\"\n}",
        "type": "js"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"result\": {\n     \"status\": \"註冊成功。\",\n      \"member\": {\n         \"Email\": \"xxx@gmail.com\",\n         \"Password\": \"1263f6273c4384121a70f2b891691d72\",\n         \"Name\": \"Demo\"\n      }\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  }
] });