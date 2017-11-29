const PowerShell = require("powershell");

module.exports = function(io) {
  io.on('connection', function(client) {
    console.log("Client connected");
    client.on('input', function(command) {
        let ps = new PowerShell(command);
        ps.on("error", err => {
            io.to(client.id).emit('err', err);
        });

        ps.on("output", data => {
            io.to(client.id).emit('output', data);
        });

        ps.on("error-output", data => {
            io.to(client.id).emit('ps-err', data);
        });

        ps.on("end", code => {
            io.to(client.id).emit('ps-end', code);
        });
    });
  });
}
