class Health
{
  constructor()
  {
    
    this.hp = 100;
    this.prevHp = this.hp;
    
    this.cMax = color("#aab5ffff");  //color when this.hp approaches 100
    this.cEmpty = color("#FF0BB0") //color when this.hp approaches 0
    
  }
  
  display()
  {
    push();
    //fill("rgb(0,0,0)"); //color for hp bar background
    noStroke(); 
    //rect(this.x, this.y, 125, 30)
    
    this.prevHp = round(lerp(this.prevHp, this.hp, 0.1), 0.1);
    
    fill(lerpColor(this.cEmpty, this.cMax, this.prevHp / 100));
    
    let canvasScale = scaleToCanvas(true);  
    translate(w/2, h*0.93);
    rect(0, 0, (this.prevHp)*1.3 * canvasScale, h*0.025, 3)
    
    
    pop();
  }
  
  hurt(amount)
  {
    this.hp -= amount / map(this.hp, 100, 0, 1, 4); //decreases as it approaches 0
    if (this.hp < 0)
    {
      this.hp = 0;
      isOver = true;
      frame = 0;
    }
    
    
  }
  
  heal(amount)
  {
    this.hp += amount * map(this.hp, 100, 0, 0.1, 1.2); //healing amount increases slightly as this.hp approaches 0
    if (this.hp > 100)
    {
      this.hp = 100;
    }
  }
}