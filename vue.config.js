module.export = {
  devServer: {
    proxy: {
      "^/api":{
        target: "http://localhost:3001",
        secure: false
      }
    }
  }
}