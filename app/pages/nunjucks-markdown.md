{% extends "layout.html" %}

{% block beforeContent %}
  {{ govukBackLink({
    text: "Back"
  }) }}
{% endblock %}

{% block content %}
  {% markdown %}  
  {# % include "will-throw-an-error.njk" % #}

  ![Bill Murray](https://cdn.glitch.com/aaa484d2-80cb-4ebe-9a60-9123dfef5298%2F942x250.jpg?1529758047870)

  # Markdown example

  ## govuk-heading-l

  ### govuk-heading-m

  #### govuk-heading-s

  Lorem ipsum, test

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam feugiat malesuada tortor eget elementum. Nulla malesuada faucibus neque, sit amet elementum odio molestie sed. Nunc a lacinia felis. Cras gravida sollicitudin lectus, a vulputate est tempor eget. Mauris non felis venenatis, sollicitudin dui tempus, efficitur ante. Donec dapibus lectus eget enim pellentesque, eleifend vestibulum augue finibus. Donec id congue ipsum, ac faucibus nisl. Mauris risus dui, sollicitudin eu nunc nec, molestie maximus justo. Etiam elementum odio nec tincidunt posuere. Vestibulum sit amet commodo quam. Sed luctus leo sem, a tempus elit malesuada nec. Mauris tempus cursus augue nec facilisis.  

  **Bold text**

  - unordered list item 1
  - unordered list item 2
  - unordered list item 3

  ---

  1. ordered list
  2. ordered list
  3. ordered list

  ```js
  var string = 'JavaScript'
  var object = {
  foo: 'bar'
  }
  ```

  `inline code comment`

  {{ govukButton({
    text: "Start now",
    isStartButton: true
  }) }}

  ## XSS Security Tests
  <!-- Make sure common XSS security vectors are removed -->
  <div onmouseover="alert('alpha')">
  <a href="jAva script:alert('bravo')">delta</a>
  <img src="x" onerror="alert('charlie')">
  <iframe src="javascript:alert('delta')" alt=""></iframe>
  <math>
    <mi xlink:href="data:x,<script>alert('echo')</script>"></mi>
  </math>
  </div>
  <script>window.alert('foxtrot')</script>

  ---

  [View the source code or remix this example on Glitch](https://glitch.com/edit/#!/govuk-frontend-markdown)
  {% endmarkdown %}
{% endblock %}
