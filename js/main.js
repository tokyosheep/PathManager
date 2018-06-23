/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
//cep7アロー関数サポートしてません
(function () {
    'use strict';

    const csInterface = new CSInterface();
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
                
    function loadJSX (fileName) {
        console.log(extensionRoot + fileName);
        csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
    }
    const GetAction = "GetAction.jsx";
    
    const path = csInterface.getSystemPath(SystemPath.EXTENSION);//extensionフォルダーのパスをしらべる相対的にファイルの場所やJSXのパスを調べる際に絶対必要
    
    const storke_color = document.forms.storke_color;
    
    const path_check = document.getElementById("path_check");
    
  
    const R = document.getElementById("R");
    const G = document.getElementById("G");
    const B = document.getElementById("B");
    
    
    const path_form = document.forms.path;
    
    const ClippingPath =    document.getElementById("ClippingPath");
    const workpath_ch  =    document.getElementById("workpath_ch");
    const workpath_rename = document.getElementById("workpath_rename");
    
    const type_of_path = document.getElementById("type_of_path");
    
    const caution = document.forms.caution;
    
    const path_num =    document.getElementById("path_num");
    const work_path =   document.getElementById("work_path");
    const noting_path = document.getElementById("noting_path");
    
    
    const rename = document.forms.rename;
    
    const rename_path = document.getElementsByClassName("rename_path");
    
    const load_file = document.forms.load_file;
    
    const load_psd =    document.getElementById("load_psd");
    const load_jpg =    document.getElementById("load_jpg");
    const load_tiff =   document.getElementById("load_tiff");
    
    const isrename = document.getElementById("isrename");
    
    
    const save = document.getElementById("save");
    
    const save_eps  = document.getElementById("save_eps");  
    const save_psd  = document.getElementById("save_psd");
    const save_jpg  = document.getElementById("save_jpg");
    const save_tiff = document.getElementById("save_tiff");
    
    const opened_file = document.getElementById("opened_file");
    const select_folder = document.getElementById("select_folder");
   
    const load_action = document.getElementById("load_action");
    const make_selection = document.getElementById("make_selection");
    
    const all_of_path = document.getElementById("all_of_path");
    
    const set_list = document.getElementById("set_list");
    const child_list = document.getElementById("child_list");
    const action_on = document.getElementById("action_on");
    
    
    loadJSX("json2.js");            
    
    const Form_elm = function(elm,childelm,bc,fccolor,opbc,opfccolor){
        this.elm = elm;
        this.bc = bc;
        this.fontcolor = fccolor;
        this.opbc = opbc;
        this.opfccolor = opfccolor;
        this.childelm = childelm;
    }
    
    Form_elm.prototype.handleEvent = function(e){
        for(let i=0 ;i<this.childelm.length;i++){    
        if(this.elm.checked){
            this.childelm[i].disabled = false;  
            disable_color(this.childelm[i],this.bc,this.fontcolor);    
            }else{
                this.childelm[i].disabled = true;    
                disable_color(this.childelm[i],this.opbc,this.opfccolor);    
            }    
        }
    }
    
    function disable_color(elm_color,color,fontcolor){
        elm_color.style.backgroundColor = color;
        elm_color.style.color = fontcolor;    
    }
    
    const pathcolor = new Form_elm(path_check,document.getElementsByClassName("RGB"),"","","#444444","#ffffff");
    const clipping_change = new Form_elm(ClippingPath,[workpath_ch]);
    const workpath_change = new Form_elm(workpath_ch,[workpath_rename],"#444444","#ffffff","","");
    const rename_num = new Form_elm(isrename,rename_path,"#444444","#ffffff","","");//renamepathはクラスを取得しているのでこれ自体が配列である
    
    
    path_check.addEventListener("click",pathcolor,false);
    ClippingPath.addEventListener("click",clipping_change,false);
    clipping_change.bc = "rgba(20,20,20)";
    workpath_ch.addEventListener("click",workpath_change,false);
    isrename.addEventListener("click",rename_num,false);
    
    ClippingPath.addEventListener("change",function(e){
        change_workpath.style.color = ClippingPath.checked ? "" : "black";
        
        if(!ClippingPath.checked||!workpath_ch.checked){
            workpath_rename.disabled = true;
                disable_color(workpath_rename,"","");
        }
        
        if(ClippingPath.checked&&workpath_ch.checked){
           workpath_rename.disabled = false;
            disable_color(workpath_rename,rename_num.bc,rename_num.fontcolor);
        }
    },false);
  /*==================================form操作==========================================*/
    
    document.getElementById("opened_file").addEventListener("click",Photoshop_process,false);
    document.getElementById("select_folder").addEventListener("click",Photoshop_process,false);
    
    function Photoshop_process(e){
        const id = this.id;//オブジェクトに埋め込むための変数（thisを使用するため）
        
        const from_ext = {
            id:id,
            ispathcheck:path_check.checked,   
            isonlycheck:false,
                
            isClippingPath:ClippingPath.checked,
            isworkpath_changr:workpath_ch.checked,
            workpath_rename:workpath_rename.value,  
                
            ispath_num:path_num.checked,
            iswork_path:work_path.checked,
            isnoting_path:noting_path.checked,
                
            isrename:isrename.checked,  
            
            load_files: [load_psd.checked,".psd",
                         load_jpg.checked,".jpg",
                         load_jpg.checked,".jpeg",
                         load_tiff.checked,".tiff",
                         load_tiff.checked,".tif"],
            
            save_files: { "save_eps":save_eps.checked,
                          "save_psd":save_psd.checked,    
                          "save_jpg":save_jpg.checked,    
                          "save_tiff":save_tiff.checked},
                 
            
            get_pathnames:function(l){
                const f =[];    
                for(let i=0;i<l.length;i++){
                    f[i] = l[i].value;
                }
                
                this.names = f;    
            },
            
            get_color_value:function(){
                const f = [];
                for(let i=0;i<arguments.length;i++)
                    { f[i] = arguments[i] ? 255 : 0 }
                this.RGBcolor = f;
            }
          
        }// end of object
        from_ext.get_pathnames(document.getElementsByClassName("rename_path"));//pathのリネームを取得
        from_ext.get_color_value(R.checked,G.checked,B.checked);
       
        const slist = [from_ext.save_files.save_eps,from_ext.save_files.save_jpg,from_ext.save_files.save_psd,from_ext.save_files.save_tiff];
        
        /*=====================================バリテーション=====================================================*/
        if(from_ext.isClippingPath&&from_ext.isworkpath_changr&&from_ext.iswork_path){
        alert("if you want to turn work path into clipping path you must check off stop process (include work path)");
        return ;    
        }
        
        const load = from_ext.load_files.filter(function(value,index,array){return typeof value !== "string"});
        if((from_ext.id=="select_folder"&&!validation_ext(load,true))||!validation_name(from_ext.names)){
            return;}
        
        if(!validation_ext(slist,false)&&from_ext.id =="opened_file"){
            if(!window.confirm(" Are you sure? You didn't check any save file so it will close all opened files without save")){return;}    
           from_ext.isonlycheck = true; 
        }
        /*=========================================================================================================*/     
        csInterface.evalScript(`select_files(${JSON.stringify(from_ext)})`);//photoshop jsxに送信
        //-----------------------------------------------------------------------------------------//
        function validation_ext(ext_list,make_alert){
            const result = ext_list.every(function(x){return x === false });
            if(result)
                {
                    if(make_alert){alert("check load extension!"); }
                    return false;
                }
                return true
        }
    
        function validation_name(f){
            if(!from_ext.isrename){return true;}
            const empty = f.some(function(x){return x === ""|| x === " "});
            const result = f.filter(function(value,index,array){return array.indexOf(value) !== array.lastIndexOf(value)});
           
            if(result.length>1||empty){
                alert("check the rename form");
                return false;
            }
                return true
        }
    }//end of photoshop process  
    
    
    /*==============================action===================================*/
        load_action.addEventListener("click",function(e){
            
            console.log(extensionRoot + GetAction);
            csInterface.evalScript('$.evalFile("' + extensionRoot + GetAction + '")',function(o){
                console.log(o);
                const action_folder = JSON.parse(o); 
                console.log(action_folder); 
                get_select(action_folder);
            });
        },false);//end of load_action event
    
        set_list.addEventListener("change",function(e){
            console.log(set_list.selectedIndex);
    console.log(child_list.selectedIndex);
             csInterface.evalScript('$.evalFile("' + extensionRoot + GetAction + '")',function(o){
                 const action = JSON.parse(o);
                 get_action_childrens(action,set_list,child_list,set_list.selectedIndex);
             })
        },false);
    
    
        function get_select(action){
            get_action_set(action,set_list,child_list);
            get_action_childrens(action,set_list,child_list,set_list.selectedIndex);
        }
        
    
        function get_action_set(action,parentslist,child){
            let action_set = "";
            for(let i=0;i<action.length;i++){
                action_set  += "<option value='"+ i +"'>"+decodeURI(action[i].name) +"</option>"; 
            }
            set_list.innerHTML = action_set;
            child_list.innerHTML = "";
        }//end of et_action_set
    
        function get_action_childrens(action,seleclist,child,parentslist){
            let acc ="";
            const num = parentslist;
            for(let i=0;i<action[num].children.length;i++){
                acc += "<option>"+decodeURI(action[num].children[i].name) +"</option>"; 
            }
            child_list.innerHTML = acc;
        }//end of get_action_childrens
        /*==============================================action============================*/
        
        make_selection.addEventListener("click",function(e){
            check_action();
            const path_obj = {
                all:all_of_path.checked,
                setlist:isAction_load(set_list[set_list.selectedIndex],set_list.selectedIndex),
                child:isAction_load(child_list[child_list.selectedIndex],child_list.selectedIndex),
                isAction:action_on.checked
                
            };
            console.log(path_obj);
            csInterface.evalScript(`make_selection_all_paths(${JSON.stringify(path_obj)})`);
            
            function check_action(){
                if(action_on.checked){
                  if(set_list.selectedIndex===-1||child_list.selectedIndex===-1){
                      alert("check the action list");
                      return;
                  }
                }
            }
            
            function isAction_load(list,num){//アクションリストが空だったらnullを返す
                if(num === -1){
                    list = null;
                }else{
                    list = list.innerHTML;
                }
                return list;
            }
            
        },false);
    
}());
    
