define({ "api": [  {    "type": "post",    "url": "/users/login",    "title": "login",    "name": "login",    "group": "User",    "version": "0.1.0",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "Email",            "description": "<p>會員Email</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "Password",            "description": "<p>會員密碼</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "const data = {\n  \"Email\": \"xxx@gmail.com\",\n  \"Password\": \"xxxxxx\"\n}",        "type": "js"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n   \"result\": {\n     \"status\": \"登入成功。\"\n   }\n}",          "type": "json"        }      ]    },    "filename": "routes/users.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/users/register",    "title": "register",    "name": "register",    "group": "User",    "version": "0.1.0",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "Email",            "description": "<p>會員Email</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "Password",            "description": "<p>會員密碼</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "Name",            "description": "<p>會員姓名</p>"          },          {            "group": "Parameter",            "type": "Blob",            "optional": false,            "field": "Avatar",            "description": "<p>會員大頭貼</p>"          }        ]      }    },    "examples": [      {        "title": "Example usage:",        "content": "const data = {\n  \"Email\": \"xxx@gmail.com\",\n  \"Password\": \"xxxxxx\",\n  \"Name\": \"Demo\"\n  \"Avatar\": \"\"\n}",        "type": "js"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n   \"result\": {\n     \"status\": \"註冊成功。\",\n      \"member\": {\n         \"Email\": \"xxx@gmail.com\",\n         \"Password\": \"1263f6273c4384121a70f2b891691d72\",\n         \"Name\": \"Demo\"\n      }\n   }\n}",          "type": "json"        }      ]    },    "filename": "routes/users.js",    "groupTitle": "User"  },  {    "type": "post",    "url": "/users/updatePassword",    "title": "updatePassword",    "name": "updatePassword",    "group": "User",    "version": "0.1.0",    "permission": [      {        "name": "none"      }    ],    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "oldPassword",            "description": "<p>舊密碼</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "newPassword",            "description": "<p>新密碼</p>"          }        ]      }    },    "header": {      "examples": [        {          "title": "Header Example: ",          "content": "{\n  \"token\": \"Bearer token\"\n }",          "type": "json"        }      ]    },    "examples": [      {        "title": "Example usage:",        "content": "const data = {\n  \"oldPassword\": \"xxxxxx\",\n  \"newPassword\": \"zzzzzz\",\n}",        "type": "js"      }    ],    "success": {      "examples": [        {          "title": "Success-Response:",          "content": "HTTP/1.1 200 OK\n{\n   \"result\": {\n     \"status\": \"更新成功。\"\n   }\n}",          "type": "json"        }      ]    },    "filename": "routes/users.js",    "groupTitle": "User"  }] });
