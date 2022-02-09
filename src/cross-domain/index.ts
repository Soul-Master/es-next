declare const showAlertButton: HTMLButtonElement;
declare const showConfirmButton: HTMLButtonElement;

function showAlert() {
    alert('test');
}

function showConfirm() {
    const result = confirm('Do you see confirm dialog?');

    console.log('result:', result);
}

showAlertButton.addEventListener('click', showAlert);
showConfirmButton.addEventListener('click', showConfirm);