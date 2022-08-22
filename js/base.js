import showAlert from './Showalert.js'
import confirmMsg from './ConfirmBox.js';
var _delete_button= `<svg class=" fill-white hover:fill-slate-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM394.8 466.1C393.2 492.3 372.3 512 346.9 512H101.1C75.75 512 54.77 492.3 53.19 466.1L31.1 128H416L394.8 466.1z"/></svg>`
var _edit_button=  `<svg class=" fill-white hover:fill-slate-100 pl-[2px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V299.6L289.3 394.3C281.1 402.5 275.3 412.8 272.5 424.1L257.4 484.2C255.1 493.6 255.7 503.2 258.8 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256zM564.1 250.1C579.8 265.7 579.8 291 564.1 306.7L534.7 336.1L463.8 265.1L493.2 235.7C508.8 220.1 534.1 220.1 549.8 235.7L564.1 250.1zM311.9 416.1L441.1 287.8L512.1 358.7L382.9 487.9C378.8 492 373.6 494.9 368 496.3L307.9 511.4C302.4 512.7 296.7 511.1 292.7 507.2C288.7 503.2 287.1 497.4 288.5 491.1L303.5 431.8C304.9 426.2 307.8 421.1 311.9 416.1V416.1z"/></svg>`
var prev_alert_timeout=null
;(function () {

    'use strict';
    var $form_add_task = $('#btn_add')
        ,$task_delete_trigger
        ,$task_detail_trigger
        ,$task_detail = $('#task-detail')
        ,task_list = {}
        ,$update_form
        ,$task_detail_content
        ,$task_detail_content_input
        ,$background_overlay=$('#background-overlay')
        ,edit_detail_position
        ;


    /*声明一下开机启动函数*/
    init();



    /*添加Task的动作监听*/
    $form_add_task.on('click',on_add_task_form_submit);

    /*查找并监听所有删除按钮的点击事件*/
    function trimtitle(sentence,characters) {
        return sentence.length>characters? sentence.slice(0,characters)+'...':sentence
    }
    function listen_task_delete() {
        $task_delete_trigger.on('click',async function(){
            var $this = $(this);
            /*找到删除按钮所在task元素*/
            var $item = $this.parent().parent();
            var index = $item.data('index');
            /*确认是否删除*/
            var tmp = await confirmMsg('Sure to Delete '+trimtitle(task_list[index].content,30));
            /*调用delete_task*/
            tmp ? delete_task(index):null;
        })
    }

    function listen_task_detail() {
        $task_detail_trigger.on('click',function () {
            edit_detail_position=[this.getClientRects()[0].x,this.getClientRects()[0].y]
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');

            show_task_detail(index);

        })
    }
    /*查看Task注释*/
    function show_task_detail(index) {
        render_task_detail(index);
        $background_overlay.fadeIn(100)
        edit_detail_position[0]=edit_detail_position[0]-$task_detail.width()
        $task_detail.css({"left":edit_detail_position[0],"top":edit_detail_position[1]})
        $task_detail.fadeIn(130);
    }

    function update_task(index,data) {
        if(!index || !task_list[index])
            return;

        task_list[index] = /*$.merge({},task_list[index],*/data;
        
        prev_alert_timeout = showAlert("Updated Successfully "+trimtitle(task_list[index].content,30) ,2000,prev_alert_timeout)
        refresh_task_list();
    }

    function hide_task_detail() {
        $task_detail.fadeOut(150);
        $background_overlay.fadeOut(100)
    }
    /*表单添加task*/
    function on_add_task_form_submit(e) {
        var new_task = {};
        /*禁用默认行为*/
        e.preventDefault();
        /*获取新Task内容*/
        var $input = $('div.add-task').find('input[name=content]');
        new_task.content = $input.val();
        /*如果输入内容为空 不执行直接返回*/
        if(!new_task.content){
           prev_alert_timeout = showAlert('WHATS THE PROBLEM',3000,prev_alert_timeout);
            return;
        }
        /*将新Task存入StoreJS*/
        if(add_task(new_task)) {
            
            prev_alert_timeout = showAlert(`Added Todo `+trimtitle(new_task.content,30),1500,prev_alert_timeout)
            $input.val('');
        }
    }

    /*将新的task存入到store.js*/
    function add_task(new_task) {
        /*将新Task推入task_list*/
        task_list.push(new_task);
        /*更新localStore*/
        refresh_task_list();
        return true;
    }

    /*删除一条task*/
    function delete_task(index) {
        /*如果没有index或index在tasklist中不存在*/
        if(index == undefined || !task_list[index]) return;
        // the title can be large so removing extra words and adding ... if possible
        delete task_list[index];
        /*更新localStorage*/
        refresh_task_list();
    }

    /*刷新localStorage数据并更新Div模板*/
    function refresh_task_list() {
        store.set('task_list',task_list);
        render_task_list();
        return true;
    }
    /*渲染指定task的详细信息*/
    function render_task_detail(index) {
        if(index == undefined || !task_list[index])
            return;

        var item =task_list[index];

        let tpl ='<form class="select-none dark:bg-primary-light bg-gray-200 bg-opacity-90 transition-colors duration-200 w-[250px] rounded-sm p-2 pt-1">'+
        '<div class="content dark:text-white text-slate-700 select-all pt-2">' +
            `${item.content.length>30?item.content.slice(0,30)+'...':item.content}` +
        '</div>' +
            '<div class=" input-item py-1 w-full"><input class=" dark:focus-visible:outline-primary focus-visible:outline-primary-vlight p-1 w-full" style="display: none;" type="text" name="content" value="' + (item.content || '')+ '"></div>'+
        '<div>' +
        '<div class="desc input-item">' +
        '<textarea class="awesome-scroll dark:focus-visible:outline-primary focus-visible:outline-primary-vlight h-24 p-2 my-1 rounded-sm w-full" name="desc">'+ (item.desc || '')+ '</textarea>' +
        '</div>' +
        '</div>' +
        '<div class="remind">' +
        '<input name="remind_date" class="px-2 py-1 text-md dark:focus-visible:outline-primary focus-visible:outline-primary-vlight" type="date" value="'+ item.remind_date + '">' +
        '</div>' +
            '<div><button type="submit" class="dark:bg-primary dark:hover:bg-primary-dark dark:active:bg-primary-dark bg-primary-vlight hover:bg-primary-light text-white p-2 my-2 mx-1 h-full text-sm tracking-wider rounded-sm font-semibold">SUBMIT</button>' +
            '<button name="cancel" class="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-2 my-2 h-full text-sm mx-1 tracking-wider rounded-sm font-semibold">CANCEL</button></div>' +
        '</form>';

        $task_detail.html('');
        $task_detail.html(tpl);
        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.content');
        let $task_detail_cancel_btn=$update_form.find('[name=cancel]')
        $task_detail_content_input = $update_form.find('[name=content]');

        $task_detail_content.on('dblclick',function () {
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })
        $update_form.on('submit',function (e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remind_date = $(this).find('[name = remind_date]').val();

            //写入localstorage
            update_task(index,data);
            hide_task_detail();
        })
        $task_detail_cancel_btn.on('click',(e)=> {
            e.preventDefault()
            hide_task_detail()
        })
    }
    /*
    *渲染【.task_list】的函数
    */
    function render_task_list() {
        var $task_list = $('.tasks-list');
        $task_list.html('');
        for(var i = 0;i<task_list.length;i++){
            var $task = render_task_item(task_list[i],i);
            $task_list.prepend($task);
        }

        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }
    /*
    *渲染一条task的模板
    */
    function render_task_item(data,index) {
        if(!data || !index) return;
        const list_item_tpl =
            '<div class="task-item py-2 px-4 dark:bg-slate-50 bg-primary-vlight dark:hover:bg-opacity-95 hover:bg-opacity-20 bg-opacity-10 my-2 flex justify-between items-center rounded-md" data-index="'+ index +'">'+
            '<span class="task-content flex-shrink-[3] pr-2">' + data.content + '</span>' +
            '<span class="fr min-w-[5.5rem] flex justify-end h-min self-center">' +
            '<button class="action delete bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full mx-1 text-sm w-9 h-9 p-2.5 transition-colors"><i>'+_delete_button+'</i></button>' +
            '<button class="action detail dark:bg-primary dark:hover:bg-primary-dark bg-primary-light hover:bg-primary transition-colors text-white rounded-full mx-1 text-sm w-9 h-9 p-2"><i>'+_edit_button+'</i></button>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl);
    }

    /*开机函数*/
    function init() {
        task_list = store.get('task_list') || [];
        if(task_list.length) render_task_list();
    }
    

})();

