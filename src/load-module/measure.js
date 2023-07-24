window.measure = function (){
    performance.measure('start');

    const mark = performance.getEntriesByType('measure')[0];
    const h = document.createElement('h4');
    h.innerText = `Load module in ${mark.duration} ms.`;

    document.body.appendChild(h);
};

performance.mark('start');