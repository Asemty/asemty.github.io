//R-Rectangle
//C-Circle
//P-Point
class MathUtils{
	
	static intersectORR(r1,r2){
		return intersectRR(r1.x,r1.y,r1.w,r1.h,r2.x,r2.y,r2.w,r2.h);
	}
	static intersectORC(r,c){
		return MathUtils.intersectRC(r.x,r.y,r.w,r.h,c.x,c.y,c.r);
	}
	static intersectORP(r,p){
		return intersectRP(r1.x,r1.y,r1.w,r1.h,p.x,p.y);
	}
	
	static intersectOCC(c1,c2){
		return intersectCC(c1.x,c1.y,c1.r,c2.x,c2.y,c2.r);
	}
	static intersectOCP(c,p){
		return intersectCP(c.x,c.y,c.r,p.x,p.y);
	}
	
	static distanceO(p1,p2){
		return distance(p1.x,p1.y,p2.x,p2.y);
	}
	////////////////////////////////////
	static intersectRR(x1,y1,w1,h1,x2,y2,w2,h2){
		return !((y1 < y2 + h2) || (y1 + h1 > r2.y2) || (x1 + r1.w1 < x2) || (x1 > x2 + w2));
	}
	static intersectRC(rx,ry,rw,rh,cx,cy,cr){
		var dx = cx - Math.max(rx, Math.min(cx, rx + rw));
		var dy = cy - Math.max(ry, Math.min(cy, ry + rh));
		return (dx * dx + dy * dy) < (cr * cr);
	}
	static intersectRP(rx,ry,w,h,px,py){
		return px >= rx && px <= rx + w && py >= ry && py <= ry + h;
	}
	
	static intersectCC(cx1,cy1,cr1,cx2,cy2,cr2){
		return distance(cx1,cy1,cx2,cy2) <= cr1 + cr2;
	}
	static intersectCP(cx,cy,cr,px,py){
		return distance(cx,cy,px,py) <= cr;
	}
	static distance(x1,y1,x2,y2){
		var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}
}
