class Editor{

    constructor(canvas, pool)
    {
        this.gameObjects = pool; 

        this.offset = {x:0,y:0};

        this.selected = {
            index:0,
            x:100,
            y:100,
            src:SPRITES.Get(GAMEOBJ[0].src, 0),
            mass:GAMEOBJ[0].d,
            fric:GAMEOBJ[0].f,
            rest:GAMEOBJ[0].r
        };

        var m = this;
        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect(); // abs. size of element
            var scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for x
            var scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
            var tile = 32;
            
            m.selected.x = ((e.clientX - rect.left)*scaleX)*MAP.scale;
            m.selected.y = ((e.clientY - rect.top)*scaleY)*MAP.scale;

            m.selected.x = ((parseInt(m.selected.x/32)*32)+16)-m.offset.x%32;
            m.selected.y = ((parseInt(m.selected.y/32)*32)+16)-m.offset.y%32;
            /*
            m.selected.x = ((e.clientX - rect.left)*scaleX)
                *MAP.scale;
            m.selected.y = ((e.clientY - rect.top)*scaleY)
                *MAP.scale;
            */    
         });

         canvas.addEventListener('mouseup', function (e) {
            if(Input.IsDown('Delete')){
                var found = m.gameObjects.Select(m.selected.x+m.offset.x, m.selected.y+m.offset.y);
                m.gameObjects.Delete(found);
            }
            else{
                var obj = GAMEOBJ[m.selected.index];

                var b = BlockFactory.Create(obj.src, m.selected.x, m.selected.y, m.offset,
                    m.selected.mass, m.selected.fric, m.selected.rest);
                m.gameObjects.Add(b);
            }
         });

         var objects =[];//{src:'block32', x:524, y:752},{src:'brick32', x:240, y:752},{src:'brick32', x:272, y:720},{src:'brick32', x:304, y:720},{src:'brick32', x:336, y:720},{src:'brick32', x:368, y:720},{src:'brick32', x:400, y:720},{src:'brick32', x:432, y:720},{src:'brick32', x:432, y:688},{src:'brick32', x:464, y:688},{src:'brick32', x:496, y:688},{src:'brick32', x:528, y:688},{src:'brick32', x:560, y:688},{src:'brick32', x:592, y:688},{src:'brick32', x:624, y:688},{src:'brick32', x:702, y:688},{src:'brick32', x:734, y:688},{src:'brick32', x:766, y:688},{src:'brick32', x:862, y:688},{src:'brick32', x:926, y:688},{src:'brick32', x:894, y:688},{src:'brick32', x:1072, y:688}]

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];

            var b= BlockFactory.Create(obj.src, obj.x, obj.y, this.offset);
            this.gameObjects.Add(b);
        }
    }

    NormalFloat(f){
        return parseFloat(f.toFixed(1));
    }
    Update(dt)
    {   
        //object select
        if(Input.IsSingle(',')){
            if(this.selected.index > 0)
            {
                this.selected.index--;

                var ass = GAMEOBJ[this.selected.index];
                this.selected.src = SPRITES.Get(ass.src, 0);
                this.selected.mass = ass.d;
                this.selected.fric = ass.f;
                this.selected.rest = ass.r;

            }
        }
        if(Input.IsSingle('.')){
            if(this.selected.index < GAMEOBJ.length-1)
            {
                this.selected.index++;

                var ass = GAMEOBJ[this.selected.index];
                this.selected.src = SPRITES.Get(ass.src, 0);
                this.selected.mass = ass.d;
                this.selected.fric = ass.f;
                this.selected.rest = ass.r;
            }
        }

        //
        if(Input.IsSingle('Insert')){
            this.selected.mass++;
        }
        if(Input.IsSingle('Delete')){
            if(this.selected.mass>0){
                this.selected.mass--;
            }
        }

        if(Input.IsSingle('Home')){
            if(this.selected.fric < 1){
                this.selected.fric = this.NormalFloat(this.selected.fric+0.1);
            }
        }        
        if(Input.IsSingle('End')){
            if(this.selected.fric>0){
                this.selected.fric = this.NormalFloat(this.selected.fric-0.1);
            }
        }

        if(Input.IsSingle('PageUp')){
            if(this.selected.rest < 1){
                this.selected.rest = this.NormalFloat(this.selected.rest+0.1);
            }
        }
        if(Input.IsSingle('PageDown')){
            if(this.selected.rest>0){
                this.selected.rest = this.NormalFloat(this.selected.rest-0.1);
            }
        }

        if(Input.IsSingle('p')){
            var objects = this.gameObjects.Get();
            var m = MAP.mapData;
            var p = "var obj =[";
            for (var i = 0; i < objects.length; i++) {
                if(objects[i].type != C.ASSETS.GROUND && 
                    objects[i].type != C.ASSETS.WALL &&
                    objects[i].bodySrc != 'player')
                {
                    if(objects[i].bodySrc != 'brick16' || objects[i].bodySrc != 'brick32'){
                        var col = parseInt(objects[i].C.x/32);
                        var row = parseInt(objects[i].C.y/32);
                        m[row][col] = 2;
                    }
                    else{
                        p += "{";
                        p += "src:'" + objects[i].bodySrc + "'";
                        p += ", x:" + parseInt(objects[i].C.x);
                        p += ", y:" + parseInt(objects[i].C.y);
                        p += "}";
                        if(i != objects.length-1){
                            p += ",";
                        } 
                    }

                }
            }
            p += "]";
            console.log(p);

            var mp = "";
            var last = -1;
            var ct = -1;

            for (var r = 0; r < m.length; r++) {
                for (var c = 0; c < m[r].length; c++) {

                    if(last != -1 && last != m[r][c]){
                        if(ct > 0){
                            mp += "" + last + "," + (ct+1) + "|";
                        }
                        else{
                            mp += "" + last + "|";
                        }
                        ct = 0;
                    }
                    else{
                        ct++;
                    }

                    last = m[r][c];
                }
            }
            if(ct > 0){
                mp += "" + last + "," + (ct+1) + "|";
            }
            else{
                mp += "" + last + "|";
            }
            console.log(mp);
        }

        DEBUG.Print("ID",this.selected.index);
        DEBUG.Print("D",this.selected.mass.toFixed(1));
        DEBUG.Print("F",this.selected.fric.toFixed(1));
        DEBUG.Print("R",this.selected.rest.toFixed(1));
        DEBUG.Print("OX",this.offset.x);
        DEBUG.Print("OY",this.offset.y);
    }

    Render(x,y)
    {
        this.offset.x = x;
        this.offset.y = y;
        GFX.Sprite(this.selected.x, this.selected.y, this.selected.src, 1, 0);
    }
}