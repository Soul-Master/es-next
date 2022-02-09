async function setup() {
    if ((await navigator.serviceWorker.getRegistrations()).length) {
        installButton.disabled = true;
        uninstallButton.disabled = false;
    }
    else {
        installButton.disabled = false;
        uninstallButton.disabled = true;
    }
}
async function install() {
    const registration = await navigator.serviceWorker.register('./service-worker.js', {
        scope: './'
    });
    if (registration === undefined) {
        alert('Unable to install');
    }
    else {
        alert('Install successfully!');
    }
    await setup();
}
async function uninstall() {
    const workers = await navigator.serviceWorker.getRegistrations();
    try {
        for (const w of workers) {
            await w.unregister();
        }
        alert('Uninstall successfully!');
    }
    catch {
        alert('Unable to uninstall');
    }
    await setup();
}
async function retrieveData() {
    let lib;
    // @ts-expect-error 
    lib = await import('https://1.esnext.app/sw-hack-external-script/externalLib.js');
    try {
        const result = await lib.retriveData();
        alert('result: ' + JSON.stringify(result));
    }
    catch (e) {
        alert('Unable to retrive data because ' + (e instanceof Error ? e.message : JSON.stringify(e)));
    }
}
await setup();
installButton.addEventListener('click', install);
uninstallButton.addEventListener('click', uninstall);
retrieveDataButton.addEventListener('click', retrieveData);
export {};
