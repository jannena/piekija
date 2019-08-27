import React, { useLayoutEffect } from "react";
import Quagga from "quagga";

const Scanner = () => {
    useLayoutEffect(() => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#scanner')    // Or '#yourElement' (optional)
            },
            decoder: {
                readers: ["ean"]
            }
        }, err => {
            if (err) {
                console.log(err, JSON.stringify(err));
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });
    }, []);

    return <div style={{ width: 200, height: 200 }} id="scanner"></div>
};

export default Scanner;