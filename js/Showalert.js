
export default function alert(message,timeout,prev_timeout=null) {
    clearTimeout(prev_timeout)
    const $alert_box=$('#alert-box')
    const _close_button = `<svg class="fill-white hover:fill-slate-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>` 
    $alert_box.html(`
    <div class="alert py-2 px-1 max-w-lg justify-between m-auto flex dark:bg-primary-light bg-primary-vlight text-white relative rounded-md">
			<div class="alert-message pl-4 font-semibold tracking-wider">${message}</div>
			<button class="close-btn w-2.5 mr-3 hover:text-slate-100"><i>${_close_button}</i></button>
		</div>
    `)
    $alert_box.css('transform','translateY(6rem)')
    let timeout_id = setTimeout(() => {
        $alert_box.css('transform','translateY(-2rem)')
    }, timeout);
    $alert_box.find('button.close-btn').on('click',function (e) { 
        e.preventDefault();
        $alert_box.css('transform','translateY(-2rem)')
        clearTimeout(timeout_id)
    });
    return timeout_id
}

