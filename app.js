const scanner = new Html5QrcodeScanner('reader', { 
    qrbox: {
        width: 250,
        height: 250,
    },
    fps: 20,
});

scanner.render(success, error);
document.getElementById("reader").firstElementChild.children[1].remove();

function success(result) {
    document.getElementById('result').innerHTML = `
        <div style="font-family: 'Arial', sans-serif; margin-top: 20px; padding: 20px; border: 2px solid #ffc107; border-radius: 12px; background-color: #fff3cd; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);">
            <h2 style="color: #856404; font-size: 24px; margin-bottom: 15px; text-align: center;">Processing...</h2>
            <p style="font-size: 18px; margin: 10px 0; text-align: center;">Please wait while we process your QR code.</p>
            <p style="font-size: 18px; margin: 10px 0; text-align: center;"><strong>Scanned Result:</strong> ${result}</p>
        </div>
    `;

    fetch('https://amar-tg.app.n8n.cloud/webhook/qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            qrid: result,
            page: 0,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('result').innerHTML = `
            <div style="font-family: 'Arial', sans-serif; margin-top: 20px; padding: 20px; border: 2px solid #28a745; border-radius: 12px; background-color: #d4edda; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);">
                <h2 style="color: #155724; font-size: 26px; margin-bottom: 15px; text-align: center;">QR Code Processed Successfully</h2>
                <p style="font-size: 18px; margin: 10px 0; text-align: left;"><strong>First Name:</strong> ${data.first_name}</p>
                <p style="font-size: 18px; margin: 10px 0; text-align: left;"><strong>Last Name:</strong> ${data.last_name}</p>
                <p style="font-size: 18px; margin: 10px 0; text-align: left;"><strong>Team:</strong> ${data.team}</p>
                <p style="font-size: 18px; margin: 10px 0; text-align: left;"><strong>QRID:</strong> ${data.qrid}</p>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `
            <div style="font-family: 'Arial', sans-serif; margin-top: 20px; padding: 20px; border: 2px solid #dc3545; border-radius: 12px; background-color: #f8d7da; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);">
                <h2 style="color: #721c24; font-size: 26px; margin-bottom: 15px; text-align: center;">Error Processing QR Code</h2>
                <p style="font-size: 18px; margin: 10px 0; text-align: center;">Failed to process the QR code. Please try again.</p>
                <p style="font-size: 18px; margin: 10px 0; text-align: center;"><strong>Scanned Result:</strong> ${result}</p>
            </div>
        `;
    });
}

function error(err) {
    console.error(err);
}
