var C = {
    ASSETS:{
        NONE:0,
        BALL:1,
        BLOCK:2,
        WALL:3,
        GROUND:4,
        PLAYER:5,
        SHOT:6,
        PLATFORM:7
    },   
    GAMEMODE:
    {
        GETREADY:0,
        GO:1,
        INPLAY:2,
        LEVELENDING:3,
        LEVELEND:4,
        GAMEWON:5,
        GAMEOVER:6
    }
}

var GAMEOBJ = [
    {id:0,col:"#999"},{id:1,col:"#333"},{id:2,col:"#555"},
    {
        id:3,
        src:'player',
        s:0,
        t:C.ASSETS.BLOCK,
        w:32,
        h:32,
        d:2,
        f:0,
        r:0
    },
    {
        id:4,
        src:'block16',
        s:0,
        t:C.ASSETS.BLOCK,
        w:16,
        h:16,
        d:16,
        f:0.2,
        r:0.2
    },
    {
        id:5,
        src:'block32',
        s:0,
        t:C.ASSETS.BLOCK,
        w:32,
        h:32,
        d:16,
        f:0.2,
        r:0.2
    },
    {
        id:6,
        src:'brick32',
        s:1,
        t:C.ASSETS.BLOCK,
        w:32,
        h:32,
        d:0,
        f:0.2,
        r:0.2
    },
    {
        id:7,
        src:'box16',
        s:0,
        t:C.ASSETS.BLOCK,
        w:16,
        h:16,
        d:8,
        f:0.2,
        r:0.2
    },
    {
        id:8,
        src:'box32',
        s:0,
        t:C.ASSETS.BLOCK,
        w:32,
        h:32,
        d:8,
        f:0.2,
        r:0.2
    },
    {
        id:9,
        src:'brick10h',
        s:0,
        t:C.ASSETS.BLOCK,
        w:160,
        h:16,
        d:16,
        f:0.2,
        r:0.2
    },
    {
        id:10,
        src:'ball16',
        s:0,
        t:C.ASSETS.BALL,
        w:8,
        h:8,
        d:8,
        f:0.8,
        r:0.8
    },
    {
        id:11,
        src:'ball32',
        s:0,
        t:C.ASSETS.BALL,
        w:16,
        h:16,
        d:8,
        f:0.8,
        r:0.8
    },
    {
        id:12,
        src:'ground32',
        s:1,
        t:C.ASSETS.BLOCK,
        w:32,
        h:32,
        d:0,
        f:0.2,
        r:0.2
    }
];

class BlockFactory
{
    static Create(id, x, y, r, offset)
    {
        var obj = GAMEOBJ.find(o=>o.id == id);

        if(obj){
            var b =null;
            if(obj.t==C.ASSETS.BALL){
                b =  new Circle(obj.t, obj.id, 
                    new Vector2(x+offset.x, y+offset.y), 
                    obj.w, obj.d, obj.f, obj.r, obj.s);
            }
            else{
                b = new Rectangle(obj.t, obj.id, 
                    new Vector2(x+offset.x, y+offset.y), 
                    obj.w, obj.h, 
                    obj.d, 
                    obj.f, 
                    obj.r, obj.s);  
            }

            PHYSICS.rotateShape(b, r);
            return b;
        }
    }
}

var FONT = {    
    'A': [
        [, 1, 0],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, , 1]
    ],
    'B': [
        [1, 1, 0],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, 1,0]
    ],
    'C': [
        [1, 1, 1],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1, 1, 1]
    ],
    'D': [
        [1, 1,0],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1,0]
    ],
    'E': [
        [1, 1, 1],
        [1,0,0],
        [1, 1, 1],
        [1,0,0],
        [1, 1, 1]
    ],
    'F': [
        [1, 1, 1],
        [1,0,0],
        [1, 1,1],
        [1,0,0],
        [1,0,0]
    ],
    'G': [
        [, 1, 1,0],
        [1,0,0,0],
        [1, , 1, 1],
        [1, , , 1],
        [, 1, 1,0]
    ],
    'H': [
        [1, , 1],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, , 1]
    ],
    'I': [
        [1, 1, 1],
        [, 1,0],
        [, 1,0],
        [, 1,0],
        [1, 1, 1]
    ],
    'J': [
        [1, 1, 1],
        [, , 1],
        [, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    'K': [
        [1, , , 1],
        [1, , 1,0],
        [1, 1,0,0],
        [1, , 1,0],
        [1, , , 1]
    ],
    'L': [
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1, 1, 1]
    ],
    'M': [
        [1,1,1,1],
        [1,0,1,1],
        [1,0,1,1],
        [1,0,0,1],
        [1,0,0,1]
    ],
    'N': [
        [1, , , 1],
        [1, 1, , 1],
        [1, , 1, 1],
        [1, , , 1],
        [1, , , 1]
    ],
    'O': [
        [1, 1, 1],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    'P': [
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1],
        [1,0,0],
        [1,0,0]
    ],
    'Q': [
        [0, 1, 1,0],
        [1, , , 1],
        [1, , , 1],
        [1, , 1, 1],
        [1, 1, 1, 1]
    ],
    'R': [
        [1, 1,0],
        [1, , 1],
        [1, , 1],
        [1, 1,0],
        [1, , 1]
    ],
    'S': [
        [1, 1, 1],
        [1,0,0],
        [1, 1, 1],
        [, , 1],
        [1, 1, 1]
    ],
    'T': [
        [1,1,1],
        [,1,0],
        [,1,0],
        [,1,0],
        [,1,0]
    ],
    'U': [
        [1,,1],
        [1,,1],
        [1,,1],
        [1,,1],
        [1,1,1]
    ],
    'V': [
        [1,,1],
        [1,,1],
        [1,,1],
        [1,,1],
        [0,1,0]
    ],
    'W': [
        [1,,,1],
        [1,,,1],
        [1,,,1],
        [1,,1,1],
        [1,1,1,1]
    ],
    'X': [
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [1,0,1],
        [1,0,1]
    ],
    'Y': [
        [1, , 1],
        [1, , 1],
        [, 1,0],
        [, 1,0],
        [, 1,0]
    ],
    'Z': [
        [1, 1, 1],
        [, , 1],
        [, 1,0],
        [1,0,0],
        [1, 1, 1]
    ],
    '0': [
        [1,1,1],
        [1,,1],
        [1,,1],
        [1,,1],
        [1,1,1]
    ],
    '1': [
        [,1,0],
        [,1,0],
        [,1,0],
        [,1,0],
        [,1,0]
    ],
    '2': [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ],
    '3':[
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '4':[
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    '5':[
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '6':[
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '7':[
        [1,1,1],
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,0,1]
    ],
    '8':[
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '9':[
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '/': [
        [,,,,1],
        [,,,1,],
        [,,1,,],
        [,1,,,],
        [1,,,,]
    ],
    '[': [
        [,1,1],
        [,1,],
        [,1,],
        [,1,],
        [,1,1]
    ],
    ']': [
        [1,1,],
        [,1,],
        [,1,],
        [,1,],
        [1,1,]
    ],
    ' ': [
        [,,],
        [,,],
        [,,],
        [,,],
        [,,]
    ],
    '?': [
        [1,1,1],
        [1,0,1],
        [0,1,1],
        [0,1,0],
        [0,1,0]
    ],
    '.': [
        [,,],
        [,,],
        [,,],
        [,,],
        [,1,]
    ],
    '£': [
        [0,1,1],
        [0,1,],
        [1,1,1],
        [0,1,0],
        [1,1,1]
    ],
    '+': [
        [0,0,0],
        [0,1,0],
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    '-': [
        [0,0,0],
        [0,0,0],
        [1,1,1],
        [0,0,0],
        [0,0,0]
    ],
    '|':
    []  //CR
};
