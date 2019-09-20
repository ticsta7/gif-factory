// 页面渲染完之后 加载
$(function(){
    
    var canvas = new fabric.Canvas('workSpace',{preserveObjectStacking:true});
    
    // canvas.backgroundColor = rgba (255,255,255,1),

    document.onkeydown = function(event) {
        var e = event || window.event ||
        arguments.callee.caller.arguments[0];
        // console.log('e.keycode',e.keyCode);
        if (e && e.keyCode == 46 || e.keyCode == 8)// delete 键
            { // 删除图层用
               var obj = canvas.getActiveObject();
               if( obj ) {
               canvas.remove( obj );                    
            }
        };
        if (e && e.keyCode == 188 )// < 键
             {  //图层向下
               var obj = canvas.getActiveObject();
               if( obj ) {
               canvas.sendBackwards( obj );                    
            }
        };
        if (e && e.keyCode == 190 )// > 键
             {  //图层向上
               var obj = canvas.getActiveObject();
               if( obj ) {
               canvas.bringForward( obj );                    
            }
        };

    };

    textInit = function(){
        $(canvas.getObjects()).each((index ,item) =>
        {
            //console.log( item );
            //循环得到的type=text的时候
            if(item.type=='text'){

                item.on( "selected", ()=>
                {
                    $('#theText').attr('disabled',false);
                    $('#theText').val(item.text);

                } );
                
            }
        }); 
    }

    update_text = function(){
        var t = $("#theText").val();
        if (t.length > 0) {
            var e = canvas.getActiveObject();
            //console.log(e),
            e.set("text", t),
            canvas.discardActiveObject(),
            canvas.renderAll(),
            $("#theText").val(""),
            $("#theText").attr("disabled", !0)
        }
    }

  
    

    //download按钮
    downloadImg = function()
    {
         //console.log(canvas.toDataURL('png'));
        download(canvas.toDataURL(), "factory-output.png", "image/png");
        
    }
    //info按钮 
    outputInfo = function()
    {
        var obj = canvas.getActiveObject();
            console.log(obj);
        // if(obj.type == 'image')
        // {
            console.log(`top = ${obj.top}`);
            console.log(`left = ${obj.left}`);
            console.log(`angle = ${obj.angle}`);
              console.log(`scaleX = ${obj.scaleX}`);
            console.log(`scaleY = ${obj.scaleY}`);
        // }
    }
    //加入gif列表    
    addToGif = function()
    {
      var dataUrl = canvas.toDataURL('png');
      var li = $("<li><img src='" + dataUrl +"'/></li>");
      $(".gifList").append( li  );  
    }
    //下载Gif
    downloadGif = function()
    {
        var theDelay = $("#theDelay").val();
       
        if ($(".gifList li img").length < 2)
            return alert("素材数量需≥2");
        
        var gif = new GIF({
            workerScript: "gif.worker.js",
            workers: 2,
            quality: 10,
            width: 460, 
            height: 460
          });
        
          
          if ( theDelay == 0 )
          return alert("请设置间隔时间");

        $('.gifList li img').each((index,item)=>
        {
            gif.addFrame( item,{ delay: theDelay }); 
        });

        gif.on('finished', function(blob) 
        {
            download(blob, "test.gif", "image/gif") ;
        });

        gif.render();

    }
    

    
        //  载入文字
     var text = new fabric.Text('又出bug了？',  {  left: 110, top: 350 });
        
         canvas.insertAt(text,2);
         text.set('top',350);
         text.set('left',145);
         text.set('angle',0);
         text.set('scaleX',0.68);
         text.set('scaleY',0.68);
         
         // 修改颜色 http://fabricjs.com/docs/fabric.Object.html#fill
         text.set({cornerSize:15,
            padding:5,
            transparentCorners:true,//顶角 是否为空心
            cornerStyle:'circle',
            cornerColor:'red',
            borderColor:'red',
            borderSize:3  });
            

    //载入图片
    fabric.Image.fromURL('moren.jpg', 
    function(oImg) 
        {
         canvas.insertAt(oImg,0);
         oImg.set('top',104);
         oImg.set('left',72);
         oImg.set('angle',0);
         oImg.set('scaleX',1);
         oImg.set('scaleY',1);
         oImg.set({
                cornerSize:15,
                padding:5,
                transparentCorners:true,//顶角 是否为空心
                cornerStyle:'circle',
                cornerColor:'red',
                borderColor:'red',
                borderSize:3  });
         });



            // 复制图层 
            copyTuceng = function () {
                var oldObject = canvas.getActiveObject();
                if ( oldObject ) {
                    // console.log(oldObject);
                    var clObject = fabric.util.object.clone(oldObject);
                    // console.log(clObject);
                    //位移一点点，别重合
                    clObject.set("top", clObject.top + 20);
                    clObject.set("left", clObject.left + 20);
                    canvas.add(clObject);
                    canvas.setActiveObject(clObject);
                    canvas.renderAll();
                    // reinit()
                } else
                    alert("请先选中图层");
            }

            // GIF序列双击，删除图层
            $(".gifList").on("dblclick", "li", function() {
                $(this).remove()
            }),
           
            
        canvas.backgroundColor = "rgba(255,255,255,1)";
        
           

      // getActiveObject(),insertAt(),sendBackwards(),bringForward
      // http://fabricjs.com/docs/fabric.Canvas.html


      textInit(); 

            
});


    