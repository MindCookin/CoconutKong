EntityClass = Class.extend({
    // can all be referenced by child classes
    currSpriteName : null,
    zindex: 0,

    // can all be overloaded by child classes
    update : function() { },

    //-----------------------------------------
    draw : function() { }
    
});