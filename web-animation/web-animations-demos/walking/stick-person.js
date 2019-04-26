Polymer('stick-person', {
  walk: false,
  direction: 'right',
  height: '300px',
  walkPlayer: null,

  ready: function() {
    this.setupSize();
    this.prepareAnim();
  },

  setupSize: function() {
    this.$.bruce.style.height = this.height;
    this.$.bruce.style.width = 'calc(' + this.height + ' * .0116)';
  },

  prepareAnim: function() {
    var anim = new AnimationGroup([
      new Animation(this.$.bruce, [
        {transform: 'translateY(' + 0.03 * this.height + 'px)', composite: 'add'},
        {transform: 'translateY(0px)', composite: 'add'}
      ], {direction: 'alternate', duration: 0.75, iterations: 4}),

      // Arms
      this.limbAnimation(this.$.leftArm, -40, 53),
      this.limbAnimation(this.$.leftForearm, -30, 0),
      this.limbAnimation(this.$.rightArm, 53, -40),
      this.limbAnimation(this.$.rightForearm, 0, -30),

      // Legs
      this.limbAnimation(this.$.leftLeg, 35, -30),
      this.limbAnimation(this.$.leftShin, 0, 20),
      this.limbAnimation(this.$.leftFoot, -110, -90),
      this.limbAnimation(this.$.rightLeg, -30, 35),
      this.limbAnimation(this.$.rightShin, 20, 0),
      this.limbAnimation(this.$.rightFoot, -90, -110)
    ], {iterations: Infinity});

    this.walkPlayer = document.timeline.play(anim);
    this.walkPlayer.paused = !this.walk;
  },

  limbAnimation: function(limb, startDeg, endDeg) {
    return new Animation(limb, [
      {transform: 'rotate(' + startDeg + 'deg)'},
      {transform: 'rotate(' + endDeg + 'deg)'}
    ], {direction: 'alternate', duration: 1500, iterations: 2});
  },

  walkChanged: function() {
    this.walkPlayer.paused = !this.walk;
  },

  directionChanged: function() {
    if (this.direction == 'left')
      this.$.bruce.style.webkitTransform = 'scale(-1,1)';
    else if (this.direction == 'right')
      this.$.bruce.style.webkitTransform = 'scale(1,1)';
  },

  heightChanged: function() {
    this.setupSize();
  }
});
