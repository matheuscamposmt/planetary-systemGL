class GeomUtils{
    static EPS = 1e-6;
    
    static signedArea(p0,p1,p2){
        /*
                |p0.x p0.y 1|
        1/2 det |p1.x p1.y 1|
                |p2.x p2.y 1|
        */

        return (p0.x*p1.y+p0.y*p2.x+p1.x*p2.y-p2.x*p1.y-p2.y*p0.x-p1.x*p0.y);
    }


    /* Based on https://stackoverflow.com/questions/25385361/point-within-a-triangle-barycentric-co-ordinates */

    

    /* p,p0,p1 and p2 are Point2d  */
    static insideTriangle(p,p0,p1,p2){
        var res = false;
        var areap0p1p2,areapp1p2,areap0pp2;
        areap0p1p2 = GeomUtils.signedArea(p0,p1,p2);
        areapp1p2  = GeomUtils.signedArea(p,p1,p2);
        areap0pp2  = GeomUtils.signedArea(p0,p,p2);

        var l0 = areapp1p2/areap0p1p2;
        var l1 = areap0pp2/areap0p1p2;
        var l2 = 1-l0-l1;

        if (((p0.x == p.x) & (p0.y == p.y)) | ((p1.x == p.x) & (p2.y == p.y)) | ((p2.x == p.x) & (p2.y == p.y))){
            res = true;
        } 
        else if ((l0 == 0) | (l1 == 0) | (l2 == 0)){
            res = true;
        }
        else if (( (0 < l0) & (l0 < 1)) & ((0 < l1) & (l1 < 1)) & ((0 < l2) & (l2 < 1))){
            res =  true;
        }

        return res;
    }

    





}

