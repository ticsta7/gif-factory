// 页面渲染完之后 加载
$(function(){
    var canvas = new fabric.Canvas('workSpace',{preserveObjectStacking:true});

    //download按钮
    downloadImg = function()
    {
         //console.log(canvas.toDataURL('png'));
        download("canvas.toDataURL('png')", "factory-output.png", "image/png");
    }
    
    // getActiveObject 和 insertAt 方法
    //  http://fabricjs.com/docs/fabric.Canvas.html
    
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
  
  
    //载入图片
    fabric.Image.fromURL('moren.jpg', function(oImg) 
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
         var text = new fabric.Text('又出bug了？',  {  left: 110, top: 350 });
         canvas.insertAt(text,2);
         text.set('top',350);
         text.set('left',110);
         text.set('angle',0);
         text.set('scaleX',1);
         text.set('scaleY',1);
         text.set('fill','red');
         // 修改颜色 http://fabricjs.com/docs/fabric.Object.html#fill
         text.set({cornerSize:15,
            padding:5,
            transparentCorners:true,//顶角 是否为空心
            cornerStyle:'circle',
            cornerColor:'red',
            borderColor:'red',
            borderSize:3  });


            // 监听键盘

            var listener = new keypress.Listener();
            
            listener.simple_combo('shift',()=>
            {
                var obj = canvas.getActiveObject();
                if( obj ) {
                    canvas.remove( obj );                    
                }
            })
});

