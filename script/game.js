class Blocky{

    constructor(canvas)
    {

        this.offset;

        this.gameObjects = new ObjectPool();

        // Gravity
        this.mGravity = new Vector2(0, 100);

        this.plr = new Player( Input,
                new Vector2(12.5*32, 6*32), 32, 32, 2, 0, 0, "BOB");
        this.gameObjects.Add(this.plr);

        this.gameObjects.Add(new Rectangle(C.ASSETS.GROUND, 'brick10h', 
            new Vector2(18.5*32, (24*32)+4), 37*32, 8, 0, 1, 0, "GRD"));
        this.gameObjects.Add(new Rectangle(C.ASSETS.WALL, 'brick10v', 
            new Vector2(-4, 12*32), 8, 24*32, 0, 0.2, .2, "WL"));
        this.gameObjects.Add(new Rectangle(C.ASSETS.WALL, 'brick10v', 
            new Vector2((37*32)+4, 12*32), 8, 24*32, 0, 0.2, .2, "WR"));
        
        this.blocks = Util.UnpackWorldObjects(MAP.mapData);

        this.editor = new Editor(canvas, this.gameObjects);        
    }

    AddObject(x, y, V){
        var d = new Shot(new Vector2(x, y), "X");
        d.V = V;    
        this.gameObjects.Add(d);
    }

    Update(dt)
    {   
        this.offset = MAP.ScrollTo(new Vector2(this.plr.C.x, this.plr.C.y));
        
        if(Input.IsDown('x') ) {
            MAP.Zoom(0.01);
        }
        else if(Input.IsDown('z') ) {
            MAP.Zoom(-0.01);
        }

        var objects = this.gameObjects.Get();

        for (var i = 0; i < objects.length; i++) {
            objects[i].Update(dt);
        }

        // Compute collisions
        PHYSICS.Update(objects, dt);

        this.editor.Update(dt);
    }

    Render()
    {

        MAP.PreRender();

        //render objects
        var objects = this.gameObjects.Get();
        for (var i = 0; i < objects.length; i++) {
            objects[i].Render(this.offset.x, this.offset.y);            
        }

        this.editor.Render(this.offset.x, this.offset.y);       

        MAP.PostRender();
  
        Input.Render();
    }
}