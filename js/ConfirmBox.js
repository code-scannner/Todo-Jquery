export default function Confirm_message(message) {
        let $confirm_box=$('#confirm-box')
        $confirm_box.find('#confirm-message').text(message)
        $confirm_box.fadeIn(200)
        let $confirm_box_div=$confirm_box.find('div').first()
        $confirm_box_div.animate({marginTop:'20px'},250)
        let promise = new Promise((resolve, reject)=> { 
            $confirm_box.find('[name=confirm-yes]').on('click',()=>{
                $confirm_box.fadeOut(200)
                resolve(true)
                $confirm_box_div.animate({marginTop:'0px'},200)
            })
            $confirm_box.find('[name=confirm-no]').on('click',()=>{
                $confirm_box.fadeOut(200)
                resolve(false)
                $confirm_box_div.animate({marginTop:'0px'},200)
            })
        })
        return promise
}