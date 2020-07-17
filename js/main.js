// --------------------------------------------
// 命名規則
// 関数・引数・関数　キャラメルケース
// 定数　スネークケース
// --------------------------------------------

// 外部変数
// toodList 未完了 配列
const todoList = [];
// todoList 削除 配列
const todoListDelete = [];
// todoLsit 完了 配列
const todoListComplete = [];
// sortの順番　
let newList = [];
let inputForm, actionForm, todoListHtml;
let RibbonCount;

// オブジェクトに付加情報をつける
function addTodo( todoObj ){
    todoObj.id = todoList.length;
    todoObj.date = new Date().toLocaleString();
    todoObj.complete =  false;
    todoObj.edit = false;
    todoObj.priority = inputForm["priority"].value;
    // 作成したtodoObjを先頭に代入ｆ
    todoList.unshift( todoObj );
    // todoObjを元にHTMLコードを生成する
    updateHtml( "inCompleteTodoList" );
    // 入力ホームをリセットする
    formreset();
}

// Listに入っている分 Html Code を作成し、Html に書き込む
function updateHtml( value ){
    let htmlCode = "";

    switch ( value ){
        // 未完了タスク
        case 'inCompleteTodoList':
            RibbonCount = 0;    // リボン用カウント
            todoList.forEach( function ( todo ){
                RibbonCount++;
                htmlCode += createHtml( todo );
            });
            sidebarOption('inCompleteTodoList');
            break;
    
        // 完了タスク
        case 'completeTodoList':
            todoListComplete.forEach( function ( todo ){
                htmlCode += createHtml( todo );
            });
            sidebarOption('completeTodoList');
            break;
        
        // 削除タスク
        case 'deleteTodoList':
            todoListDelete.forEach( function ( todo ){
                htmlCode += createHtml( todo );
            });
            sidebarOption('deleteTodoList');
            break;

        // 優先度並び替え
        case 'sortPriorityTodoList':
            newList.forEach( function ( idValue ){
                todoList.forEach( function ( listValue ){
                    ( idValue == listValue.id ) ? htmlCode += createHtml( listValue ) : null;
                });
            });
            break;

        // 日付並び替え
        case 'sortTimeTodoList':
            newList.forEach( function ( timeValue ){
                todoList.forEach( function ( listValue ){
                    ( timeValue == listValue.id ) ? htmlCode += createHtml( listValue ) : null;
                });
            });
            break;
        
        default:
            break;
    }

    todoListHtml.innerHTML = htmlCode;
}

// sidebar選択時 HTML変更
function sidebarOption( value ){
    document.querySelector('.sidebarInComplate').classList.remove('borderAction');
    document.querySelector('.sidebarComplate').classList.remove('borderAction');
    document.querySelector('.sidebarDelete').classList.remove('borderAction');
    switch( value ){
        case 'inCompleteTodoList':
            document.querySelector('.sidebarInComplate').classList.add('borderAction');
            break;
    
        // 完了タスク
        case 'completeTodoList':
            document.querySelector('.sidebarComplate').classList.add('borderAction');
            break;
        
        // 削除タスク
        case 'deleteTodoList':
            document.querySelector('.sidebarDelete').classList.add('borderAction');
            break;

        default:
            break;
    }
}

// TodoList の Html Code を作成する
function createHtml( todo ){
    let htmlCode = "";
    switch( RibbonCount ){
        case 1:
        case 2:
        case 3:
            htmlCode = '<li class="todoList"><span class="todoListContent"' + 'id="' + todo.id + '">' + todo.content + '</span>' + '<span class="todoListDate">' + todo.date + '</span>' + '<div class="todoListEdit"><i class="fas fa-ellipsis-h"></i></div><div class="newRibbon"><span class="newRibbonContent">new</span></div></li>';
            break;
        default:
                htmlCode = '<li class="todoList"><span class="todoListContent"' + 'id="' + todo.id + '">'  + todo.content + '</span>' + '<span class="todoListDate">' + todo.date + '</span>' + '<div class="todoListEdit"><i class="fas fa-ellipsis-h"></i></div></li>';
            break;
    }
    return htmlCode;
}

// todoをtodoObjに登録
function todoRegistration( event ){
    event.preventDefault();
    const todoObj = {
        content: inputForm["content"].value
    }
    addTodo( todoObj );
    document.querySelector('#content').value = "";
}

///////////////////////////////////////////////////////
//                     並び替え                      //
///////////////////////////////////////////////////////

// 作成日順に並べ替える
function sortTime(){
    let nowList = {};
    newList = [];

    todoList.forEach( function ( value ){
        nowList[ value.id ] = value.date.replace( /[^0-9]/g, '' );
    });

    for( let key in nowList )newList.push( key );

    function compare( a, b ){
        return nowList[b] - nowList[a];
    }
    newList.sort( compare );

    updateHtml( "sortTimeTodoList" );
}

// 優先度順に並べ替える
function sortPriority(){
    let nowList = {};
    newList = [];

    // 未完了の List から ID と 優先度を nowList に入れておく
    todoList.forEach( function ( value ){ 
        nowList[ value.id ] = Number( value.priority );
    });

    for( let key in nowList )newList.push( key );

    function compare( a, b ){
        return nowList[a] - nowList[b];
    }
    newList.sort( compare );

    updateHtml( "sortPriorityTodoList" );
}

// 優先度順に並び替える
function prioritySorting(){
    let sortOrder = document.querySelector("#sortOrder").selectedIndex;

    ( sortOrder == 0 ) ? sortTime() : sortPriority() ;
}


///////////////////////////////////////////////////////
//                   todo完了・削除                   //
///////////////////////////////////////////////////////
// checkリボン表示 非表示
function todoActionRibbonShowHide(){
    let checkRibbon = document.querySelectorAll('.checkRibbon').length;
    let ribbonSwitch = document.querySelector('.actionActive');
    if( checkRibbon > 0 ){
        ribbonSwitch.style.display = 'block';
    } else {
        ribbonSwitch.style.display = 'none';
    }
}

// checkリボン on off
function todoActionRibbon(){
    let newElement;
    let newContent;

    newElement = document.createElement("div");
    newElement.className = 'checkRibbon';
    newElement.appendChild( document.createElement("span") );
    newElement.children[0].className = 'checkRibbonContent';
    newContent = document.createTextNode("check");
    newElement.children[0].appendChild(newContent);

    return newElement;
}

// 削除・完了ボタンが押されたら　削除・完了配列に連想配列を移動する
function todoAction( value ){

    event.preventDefault();

    let todoListElement = document.querySelectorAll('.todoList');
    let checkRibbon = document.querySelectorAll('.checkRibbon');
    let target;
    let elementId;

    todoActionRibbonShowHide();

    for( let i = 0; i < todoListElement.length; i++ ){
        todoListElement[i].onclick = function(){
            if( todoListElement[i].lastChild.className === "checkRibbon" ){
                todoListElement[i].lastChild.remove();
            } else {
                todoListElement[i].appendChild( todoActionRibbon() );
            }
        }
    }
    
    for( let i = 0; i < checkRibbon.length; i++ ){

        elementId = checkRibbon[i].parentNode.children[0].id;
        target = todoList.filter( function ( object ){
            return elementId == object.id;
        });

        if( value == "delete" || value == "complete" ){
            // 削除済み完了済みの配列に代入
            ( value == "delete" ) ? todoListDelete.unshift( target[0] ) : todoListComplete.unshift( target[0] );

            // 削除した配列をtodoListから削除する
            todoList.splice( todoList.indexOf( target[0]), 1 );
        }
    }

    if( value == "delete" || value == "complete" ){

        updateHtml( "inCompleteTodoList" );
        switch ( value ){
            case 'complete':
                alert( target[0].content + "完了しました。" );
                break;
    
            case 'delete':
                alert( target[0].content + "削除しました。" );
                break;

            default:
                break;
        }        
    }
}

///////////////////////////////////////////////////////
//                      todo編集                     //
///////////////////////////////////////////////////////
// モーダルウィンドウを表示する
let displayActive = document.querySelectorAll( ".displayActive" );

// モーダルウィンドウを閉じる
function modalWindowClose(){
    for( let j = 0; j < displayActive.length; j++ )displayActive[j].style.display = 'none';
}

// 更新ボタンが押されたらtodo一覧の方も更新する
function modalWindowUpdate( value ){
    let content = document.querySelector("#modalInput").value;

    for( let i = 0; i < todoList.length; i++ ){
        if( todoList[i].id == value ){
            todoList[i].content = content;
        }
    }

    updateHtml("inCompleteTodoList");
    modalWindowClose();
}

// モーダルウィンドウ記載情報更新
function modalWindowCreate( todo ){
    let obj = todoList.filter( function( value ){
        return value.id == todo;
    });

    document.querySelector("#modalInput").value = obj[0].content;
    document.querySelector("#modalDate").innerHTML = obj[0].date;
}

// モーダルウィンドウ表示
function modalWindow(){
    let click;
    let todoListEdit = document.querySelectorAll('.todoListEdit');

    for( let i = 0; i < todoListEdit.length; i++ ) {
        todoListEdit[i].onclick = function () {
            click = todoListEdit[i].parentNode.children[0].id;
            for( let j = 0; j < displayActive.length; j++ )displayActive[j].style.display = 'block';   
            modalWindowCreate( click );
            let objId = todoList.filter( function ( obj ){
                return obj.id == click;
            });
            document.querySelector("#modalWindowUpdate").addEventListener( 'click', function(){modalWindowUpdate( objId[0].id)},{once: true, passive: true, capture: true});
        }
    }
    // モーダルウィンドウを非表示
    document.querySelector("#modalClose").addEventListener( 'click', modalWindowClose );
}

///////////////////////////////////////////////////////
// 　                 初期設定        　　　　　　　　 //
///////////////////////////////////////////////////////

// DOM作成
function createDom(){
    inputForm = document.querySelector("#input_form");
    actionForm = document.querySelector("#action_form");
    todoListHtml = document.querySelector("#todo_list");
}

// DOMにイベントを設定
function domEvent(){
    // todoを登録
    inputForm["content_add_button"].addEventListener( 'click', todoRegistration );
    // todo 完了削除イベント
    document.addEventListener( 'click', todoAction );
    document.querySelector("#delete").addEventListener( 'click', function(){todoAction("delete")} );
    document.querySelector("#complete").addEventListener( 'click', function(){todoAction("complete")} );

    // todo 内容編集イベント
    document.addEventListener( 'click', modalWindow );
}

// 初期化
function initialize(){
    createDom();
    updateHtml();
    domEvent();
}

// 初期イベント
document.addEventListener( "DOMContentLoaded", initialize.bind( this ));