
var template = require('tower-template')
  , directive = require('tower-directive')
  , scope = require('tower-scope')
  , assert = require('component-assert')
  , query = require('component-query');

describe('template', function(){
  beforeEach(directive.clear);
  
  it('should execute all', function(){
    directive('data-text', function(scope, element, attr){
      element.textContent = scope[attr.value];
    });

    directive('data-title', function(scope, element, attr){
      element.setAttribute('title', scope[attr.value]);
    });

    var fn = template(document.body);
    fn(scope('random').init({ foo: 'Foo', bar: 'Bar' }));

    assert('Foo' === query('#should-execute-all').title);
    assert('Bar' === query('#should-execute-all span').textContent);
  });

  it('should use `scope("root")` if none is passed in', function(){
    directive('data-html', function(scope, element, attr){
      element.innerHTML = scope[attr.value];
    });

    scope.root().set('foo', 'Hello World');

    var fn = template(document.body);
    fn(scope.root());

    assert('Hello World' === query('#should-use-root-scope').innerHTML);
  });

  describe('directives', function(){
    it('should have `data-text`', function(){
      assert(true === directive.defined('data-text'));
      var root = scope.root();
      root.set('textDirective', 'Text Directive');
      var fn = template(query('#directives'));
      fn(root);
      assert('Text Directive' === query('#data-text-directive span').textContent);
    });

    // XXX: should iterate through all to test them all.
    it('should have `data-[attr]`', function(){
      assert(true === directive.defined('data-title'));
      var root = scope.root();
      root.set('attrDirective', 'Attribute Directive');
      var fn = template(query('#directives'));
      fn(root);
      assert('Attribute Directive' === query('#data-attr-directive a').title);
    });

    it('should have event directives `on-[event]`', function(done){
      assert(true === directive.defined('on-click'));
      var root = scope.root();
      root.set('eventDirective', function(){
        done();
      });
      var fn = template(query('#directives'));
      fn(root);

      var event = document.createEvent('UIEvent');
      event.initUIEvent('click', true, true);
      event.clientX = 5;
      event.clientY = 10;
      event.passThrough = 'foo';
      query('#data-event-directive a').dispatchEvent(event);
    });
  });

  describe('data-scope', function(){
    it('should create a nested scope', function(){
      assert(false === scope.defined('custom'));
      scope('custom')
        .attr('foo', 'string', 'Custom Scope Property!');
      var fn = template(query('#custom-scope'));
      //var customScope = scope('custom').init();
      //console.log(customScope)
      //console.log(customScope.get('foo'));
      fn(scope.root());
    });
  });

  after(function(){
    //document.body.removeChild(query('#tests'));
  });
});