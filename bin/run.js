let BeaconsProcess = require('../obj/src/container/MetricsProcess').MetricsProcess;

try {
    let proc = new MetricsProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}
