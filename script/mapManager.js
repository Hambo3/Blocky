class MapManger{

    constructor(ctx, md, b){
        this.mapData = Util.UnpackMap(md.data);

        this.offset = new Vector2();
        this.planSize = new Vector2(md.size.world.width, md.size.world.height);
        this.mapSize = new Vector2(md.size.world.width, md.size.world.height);
        this.mapSize.Multiply(md.size.tile.width);
        this.screenSize = new Vector2(md.size.screen.width, md.size.screen.height);
        this.screenSize.Multiply(md.size.tile.width);

        this.bounds = new Vector2(this.mapSize.x+b.x,this.mapSize.y+b.y);

        this.tileSize = md.size.tile.width;
        this.scale = 1;
        this.maxScale = 1;
        this.minScale = 0.3;

        this.screenCtx = ctx;

        this.tileCanvas = Util.Context(this.mapSize.x, this.mapSize.y);
        this.osCanvas = Util.Context(this.mapSize.x, this.mapSize.y);

        this.screenCtx.imageSmoothingEnabled = true;        
        this.osCanvas.imageSmoothingEnabled = true;
        this.rend = new Render(this.tileCanvas.ctx);
    }

    Init(reset){
        if(reset){            
            this.rend.Box(0,0,this.mapSize.x,this.mapSize.y);
        }
        this.TileInit();
    }
    
    TileInit(){
        var bx = ["#999","#333","#555","#777"];
        var p;
        var col = this.planSize.x;
        var row = this.planSize.y;
        var h = this.tileSize/2;
        try {
            for(var r = 0; r < row; r++) 
            {
                for(var c = 0; c < col; c++) 
                {
                    p = this.mapData[r][c];
                    var pt = new Vector2(c * this.tileSize, r * this.tileSize);   
                    this.rend.Box(pt.x, pt.y,32,32,bx[p]);
                }
            }            
        } catch (error) {
            console.log("r:"+r+ " c:"+c);
        }

    }

    Zoom(rate){
        this.scale = Util.Clamp(this.scale+rate, this.minScale, this.maxScale);
    }

    MaxZoom(){
        this.scale = this.maxScale;
    }

    MinZoom(){
        this.scale = this.minScale;
    }

    ScrollTo(target, lerp){
        var sc = this.screenSize.Clone();
        var bn = this.bounds.Clone();
        sc.Multiply(this.scale);

        var destx = target.x - (sc.x/2);
        var desty = target.y - (sc.y/2);

        if(lerp)
        {
            destx = Util.Lerp(this.offset.x, target.x - (sc.x/2), lerp);
            desty = Util.Lerp(this.offset.y, target.y - (sc.y/2), lerp);
        }

        if(destx < 0){
            destx = 0;
        }
        if(destx > bn.x - (sc.x)){
            destx = bn.x - (sc.x);
        }

        if(desty < 0){
            desty = 0;
        }
        if(desty > bn.y - (sc.y)){
            desty = bn.y - (sc.y);
        }

        this.offset.x = destx;
        this.offset.y = desty;

        return this.offset;
    }

    ScreenBounds(){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);
        sc.Add(this.offset);
        return {Min:this.offset, Max:sc};
    }

    PreRender(){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);

        this.osCanvas.ctx.drawImage
        (
            this.tileCanvas.canvas, 
            this.offset.x, this.offset.y, sc.x, sc.y,
            0, 0, sc.x, sc.y
        );

        return this.offset;
    }
    
    PostRender(){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);

        this.screenCtx.drawImage
        (
            this.osCanvas.canvas, 
            0, 0, sc.x, sc.y,
            0, 0, this.screenSize.x, this.screenSize.y
        );
    }

    ImageRender(x,y,w,h){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);

        this.screenCtx.drawImage
        (
            this.osCanvas.canvas, 
            0, 0, sc.x, sc.y,
            x, y, w,h
        );
    }

    Content(pos){
        var c = Math.floor(pos.x / this.tileSize);
        var r = Math.floor(pos.y / this.tileSize);
        return this.mapData[r][c];
    } 

    //draw stuff
    Skid(x, y, col,d){
        this.rend.Box(x,y,d|3,d|3, col);
    }
}