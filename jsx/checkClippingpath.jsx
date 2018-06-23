
    
    
    function select_files(from_ext){
   
    if(from_ext.id=="select_folder"){select_files(from_ext)}    
    if(from_ext.id=="opened_file"){
        if(documents.length==0){alert ("there's nothing opened file"); return;}    
        batchprocess(from_ext)}
    
    /*===================================================================================================================*/
    function select_files(from_ext){
        preferences.rulerUnits = Units.PIXELS;    
        var wildcard = [];
        var rootFolderObj = Folder.selectDialog("フォルダを選択してください");
        for(var f=0;f<from_ext.load_files.length;f+=2){
            if(from_ext.load_files[f]){
                wildcard.push(from_ext.load_files[f+1]);  
            }    
        }    
        forderget (wildcard,rootFolderObj);
        }
     /*======================================================================================================================*/   
        
        
        function batchprocess(from_ext){
    //以下開いたファイルに適応させる処理
  
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------バッチ処理----------------------------------------------------------------------------------------------------------
        var sourceDocs=new Array();//ソースドキュメント用の配列を作成
        var log ="";
         
    for(var k=0; k<app.documents.length; k++){
        var soudocObj = app.documents[k];
            app.activeDocument = soudocObj ;
            sourceDocs[k]=app.documents[k];//ソースドキュメント用の配列をつくりまずは格納そしてソースドキュメントを後に指定したらソースドキュメントを順番に閉じることができた

            }
        
     for(var po=0; po<sourceDocs.length; po++){//アクティブドキュメントのlengthではなく一度事前に取得したソースゴキュメントlengthなのに注意
    app.activeDocument=sourceDocs[po];
 
    log += make_log();
             
        }
     write_log(Folder.desktop+"\\log.txt",log);
    }//end of batchprocess
        
    
    
    /*======================================================================================================================*/
    function make_log(){
        var result =  main_process();
        if(result==false||result==undefined){return "";}//undefinedかfalseだったら何も返さない。
        return result;
    }
    
    
    /*=======================================================================================================================*/
    
    function forderget (wildcard,rootFolderObj){//開いたフォルダに適応させるのチェックをはずした場合の分岐
        //以下再帰的処理
        
        fList = getAllFile(rootFolderObj, wildcard); // 拡張子は小文字で
        var log ="";
        for(var i=0; i<fList.length; i++){  app.open(fList[i]);
            log += make_log();
      
         }
     write_log(Folder.desktop+"\\log.txt",log);
        // サブフォルダも含めたファイル一覧を取得する関数
        function getAllFile(folderObj, ext){
            if (!folderObj) return false; // キャンセルされたら処理しない
            var list = [];
            getFolder(folderObj);
            return list;
            // フォルダ内の一覧を取得
            function getFolder(folderObj){
                var fileList = folderObj.getFiles();
                for (var i=0; i<fileList.length; i++){
                    if (fileList[i].getFiles) {
                        getFolder(fileList[i]); // サブフォルダがある限り繰り返す
                    }else{
                        var f = fileList[i].name.toLowerCase();//toLowerCaseメソッドは対象の文字列の中に大文字のアルファベットが含まれる場合、小文字に変換した文字列を返します
                        for(var j=0; j<ext.length; j++){
                            if (f.indexOf(ext[j]) > -1) { list.push(fileList[i]); }//文字列を検索します。検索開始位置は省略することができます。
                        }
                    }
                }
            }
        } 
    }
    
    
    
    /*=====================================================================================================================*/
    
    function main_process(){
        var text_log = "";
        if(!getstatus()){return false;}
        var status = getstatus ();//file情報取得
        
        var path_num = activeDocument.pathItems.length;
        text_log = "file name"+status.dName+"\na number of path:"+path_num;
        
          if(path_num==0&&from_ext.isnoting_path){//パスの数が0だとfor分の中の処理をとばしてしまうためfor分の外に必ず置くこと
            return false;
            }
        for(var p=0;p<path_num;p++){
            if(!caution(activeDocument.pathItems[p],path_num)){return false;}
            if(from_ext.isClippingPath){  turn_clipping(activeDocument.pathItems[p])}
            text_log += rename_paths(activeDocument.pathItems[p],p);
        
        }
        
        multiple_save()

        if(from_ext.ispathcheck){
            make_stroke(from_ext.RGBcolor,path_num);
            }
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        return text_log+"\n\n";
    }//end of main process
    
  /*==============================================================*/
    function turn_clipping(path){
            if(path.kind=="PathKind.WORKPATH"&&from_ext.isworkpath_changr){
                path.name=checkname(from_ext.workpath_rename);    
            }
    
            if(path.kind!="PathKind.CLIPPINGPATH"){
             try{   
                path.makeClippingPath(0.2);
                }catch(e){
                    alert ("you must check what kind of the path..");   
                    return;    
                }
            }
        
        
        }//end of clipping
  
  
    function rename_paths(path,p){
            
            if(path.name==from_ext.names[p]){return "\nname of path:"+path.name+"       :"+path.kind;}//現状のパスの名前をリネームの名前が一緒だったらリターン
        
            if(from_ext.isrename&&from_ext.names.length>p){
             path.name = checkname(from_ext.names[p]);
             }
         return "\nname of path:"+path.name+"       :"+path.kind;
        }
    
    
    function checkname(pathname){
        for(var n=0;n<activeDocument.pathItems.length;n++){
  
            if(activeDocument.pathItems[n].name==pathname){
                pathname = pathname + "+";
                }
        }  
        return pathname;
        }


    function caution(path,pathnum){
        if(pathnum>1&&from_ext.ispath_num){
            return false;
        }    
        if(path.kind=="PathKind.WORKPATH"&&from_ext.iswork_path){
            return false;
        }    
    
      
    
        return true;
    }//------end of caution
  
  
     function make_stroke(RGB,path_num){
            activeDocument.artLayers.add();//新規レイヤー作成
            var pointColor = new SolidColor;//パスの色を定義
            pointColor.rgb.red = RGB[0];
            pointColor.rgb.green = RGB[1];
            pointColor.rgb.blue = RGB[2];
          
             if(activeDocument.mode=="DocumentMode.GRAYSCALE"){   //グレースケールだったら一度RGBに変換
                activeDocument.changeMode(ChangeMode.RGB);//カラーモードをRGBに変換 
                }
            
             if(path_num<1){
                text(pointColor,"withoutpath"); 
                 }else{
                     for(var i=0;i<path_num;i++){
                        try{
                            //パスの名前を取得して取得したパスに対して処理する
                            var pobj = activeDocument.pathItems[i];
                            pobj.makeSelection();
    
                            var w = activeDocument.width;
                            var h = activeDocument.height;
                
                            var per = w+h;
                            app.activeDocument.selection.stroke(pointColor,per/600,StrokeLocation.INSIDE);
                            app.activeDocument.selection.deselect();
                        }catch(e){
                            alert ("You must check the path condition in this file");
                            app.activeDocument.selection.deselect();
                            text(pointColor,"check the path");
                            
                        }
                }
                     }  
             var foldername = Folder.desktop+"\\pathcheck";
             makefolder(foldername);
             save2(foldername);  
             
        }//----------------------------------end of makestroke
    
        function text(pointColor,attention){
            var w = activeDocument.width;
            var h = activeDocument.height;
                
            var per = w+h;
            var textsize = per/21
        
            preferences.rulerUnits = Units.POINTS;
            docObj = app.activeDocument
            layObj = docObj.artLayers.add();
            layObj.kind = LayerKind.TEXT;
            layObj.textItem.position = Array(w/5,h/2); //座標
            layObj.textItem.contents = attention;
            layObj.textItem.size = textsize ;
            layObj.textItem.color = pointColor; //色
        }//end of text
    
    
    
  /*===========================save===============================*/  
  
        function multiple_save(){
            
             if(from_ext.isonlycheck){return ;}
              var fullpath = activeDocument.fullName;//ドキュメントのパスがなければ処理を中止
             
              if(from_ext.save_files.save_eps){ EPS(fullpath)}
              if(from_ext.save_files.save_psd){ PSD(fullpath)}
              if(from_ext.save_files.save_jpg){ savejpeg(fullpath)}
              if(from_ext.save_files.save_tiff){ tiff(fullpath)}
            
            
            }
  
  
  
  
  
  
        function savejpeg(fullpath){
            var fileObj = new File(fullpath);
            jpegOpt = new JPEGSaveOptions();
            jpegOpt.embedColorProfile = true;
            jpegOpt.quality = 12;
            jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
            jpegOpt.scans = 3;
            jpegOpt.matte = MatteType.NONE;
            activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
        }
    
        function save2(foldername){
            var fileObj = new File(foldername+"/"+activeDocument.name);//作成したフォルダの中に保存
            jpegOpt = new JPEGSaveOptions();
            jpegOpt.embedColorProfile = true;
            jpegOpt.quality = 12;
            jpegOpt.formatOptions = FormatOptions.STANDARDBASELINE;
            jpegOpt.scans = 3;
            jpegOpt.matte = MatteType.NONE;
    
            activeDocument.saveAs(fileObj, jpegOpt, true, Extension.LOWERCASE);
            
        }
        
        function tiff(fullpath){
            var fileObj = new File(fullpath);  
            tiffOpt = new TiffSaveOptions();
            tiffOpt.alphaChannels = false;
            tiffOpt.annotations = true;
            tiffOpt.byteOrder = ByteOrder.MACOS;
            tiffOpt.embedColorProfile = true;
            tiffOpt.imageCompression = TIFFEncoding.NONE;
            tiffOpt.jpegQuality = 12;
            tiffOpt.layerCompression = LayerCompression.RLE;
            tiffOpt.layers = false;
            tiffOpt.saveImagePyramid = false;
            tiffOpt.spotColors = false;
            tiffOpt.transparency = false;
            activeDocument.saveAs(fileObj, tiffOpt, true, Extension.LOWERCASE);    
        }      
    
        function PSD(fullpath){
            var fileObj = new File(fullpath);
            psdOpt = new PhotoshopSaveOptions();
            psdOpt.alphaChannels = true;
            psdOpt.annotations = true;
            psdOpt.embedColorProfile = true;
            psdOpt.layers = true;
            psdOpt.spotColors = false;
            activeDocument.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);    
        }
    
        function EPS(fullpath){
            fileObj = new File(fullpath);
            epsOpt = new EPSSaveOptions();
            epsOpt.embedColorProfile = true;
            epsOpt.encoding = SaveEncoding.ASCII;
            epsOpt.halftoneScreen = false;
            epsOpt.interpolation = false;
            epsOpt.preview = Preview.MACOSJPEG;
            epsOpt.psColorManagement = false;
            epsOpt.transferFunction = false;
            epsOpt.transparentWhites = false;
            epsOpt.vectorData = false;
            activeDocument.saveAs(fileObj, epsOpt, true, Extension.LOWERCASE);    
        }
        
    
    
        function makefolder(){
            for(var no =0; no<arguments.length; no++){//引数に渡された数だけフォルダを作る
                folderObj = new Folder(arguments[no]);
                folderObj.create();}
        }
   /*====================textdata=======================================*/ 
    
        function getstatus (){
        //----------------------------------パス---------------------------------------
        try{
            var fullpath = activeDocument.fullName;//ドキュメントのフルパス
        }catch(e){
            if(!from_ext.isonlycheck){alert ("can't find document path");}
            return false;
            }
        //------------------------------------------------------------------------------
        var fRef = activeDocument.path;//ドキュメントの入っているフォルダのパス
        var fef = fRef.parent//ドキュメントの親の親のフォルダ（trimmed）のパス
        var fero = fef.parent//ドキュメントのさらに上のフォルダ
        //------------------------------------------------------------------------------
        var folderName = getfilename(fRef);//各親フォルダーの名前取得
        var parentName = getfilename(fef);
        var grandName = getfilename(fero);
        //------------------------------------------------------------------------------
        var dName = activeDocument.name;
        //------------------------------------------------------------------------------
        var w = activeDocument.width.value;
        var h = activeDocument.height.value;
        var res = activeDocument.resolution;
        //-----------------------------------------------------------------------------
        return {
        fullpath:fullpath,    

        fRef:fRef,
        fef:fef,
        fero:fero,

        folderName:folderName,  
        parentName:parentName,
        grandName:grandName,

        dName:dName,
        w:w,
        h:h,
        res:res
     };      
    
    
    
    }


    function getfilename(fpath){
    fileObj = new File(fpath);
    return fileObj.name;    
        }

    function write_log(filename,content){
        fileObj = new File(filename);
        fileObj.open("w");
        fileObj.write(content);
        fileObj.close();
        
    }
    
    
   /*==================================================================*/ 
   }//end of select files   
    /*  var from_ext = {//ダミーオブジェクト
            ispathcheck:true,   
                
            isClippingPath:true,
            isworkpath_changr:true,
            workpath_rename:"path0work",  
                
            ispath_num:true,
            iswork_path:true,
            isnoting_path:true,
                
            isrename:true,  
            
            load_files: [true,".psd",
                         true,".jpg",
                         true,".jpeg",
                         false,".tiff",
                         false,".tif"],
            
            save_files: { "save_eps":false,
                          "save_psd":false,    
                          "save_jpg":false,    
                          "save_tiff":true},
                 
            
            get_pathnames:function(l){
                var f =[];    
                for(var i=0;i<l.length;i++){
                    f[i] = l[i];
                }
                
                this.names = f;    
            },
            
            get_color_value:function(){
                var f = [];
                for(var i=0;i<arguments.length;i++)
                    { f[i] = arguments[i] ? 255 : 0 }
                this.RGBcolor = f;
            }
          
        }
        from_ext.get_pathnames([1,2,3,4,5]);//pathのリネームを取得
       
        
        from_ext.get_color_value(false,true,false);
        select_files(from_ext); */
    
    
function make_selection_all_paths(path_obj){

batchprocess();


function process_selection(){
    
if(app.activeDocument.pathItems.length===0){return;}    

if(path_obj.all){    
    
activeDocument.channels.add();
for(var i=0;i<app.activeDocument.pathItems.length;i++){
app.activeDocument.pathItems[i].makeSelection();
fillout_color([255,255,255]);
activeDocument.selection.deselect();
}


activeDocument.selection.load(activeDocument.channels[activeDocument.channels.length-1]);//パスから作ったマスクを読み込み
visible_RGB();
activeDocument.channels[activeDocument.channels.length-1].remove();
}else{
app.activeDocument.pathItems[0].makeSelection();        
    }

if(path_obj.isAction){//アクション実行する場合はアクション実行
try{    //エラーチェック念のため
doAction(path_obj.child,path_obj.setlist);    
}catch(e){
return;    
    }
    }


}//end of process_selection

function fillout_color(rgb){
        RGBColor = new SolidColor();
        RGBColor.red = rgb[0];
        RGBColor.green = rgb[1];
        RGBColor.blue = rgb[2];
        activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);
        activeDocument.selection.deselect();
    }//end of fillout_color  



    function visible_RGB(){//チャンネル表示からRGB表示に戻す
        for(var i = 0;i<activeDocument.channels.length;i++){
            if(i<3){
                activeDocument.channels[i].visible = true;
            }else{
                activeDocument.channels[i].visible = false;    
            }
        }
        //rgbチャンネル選択
        var idslct = charIDToTypeID( "slct" );
        var desc9 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        var ref5 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idRGB = charIDToTypeID( "RGB " );
        ref5.putEnumerated( idChnl, idChnl, idRGB );
        desc9.putReference( idnull, ref5 );
        executeAction( idslct, desc9, DialogModes.NO );
}//end of visible rgb
 function batchprocess(){
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------バッチ処理----------------------------------------------------------------------------------------------------------
        var sourceDocs=new Array();//ソースドキュメント用の配列を作成
    for(var k=0; k<app.documents.length; k++){
        var soudocObj = app.documents[k];
            app.activeDocument = soudocObj ;
            sourceDocs[k]=app.documents[k];//ソースドキュメント用の配列をつくりまずは格納そしてソースドキュメントを後に指定したらソースドキュメントを順番に閉じることができた

            }   
     for(var po=0; po<sourceDocs.length; po++){//アクティブドキュメントのlengthではなく一度事前に取得したソースゴキュメントlengthなのに注意
    app.activeDocument=sourceDocs[po];    
    process_selection();
        }
    
    }//end of batchprocess
}
       
            
  