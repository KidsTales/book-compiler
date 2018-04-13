new Vue({
  el: "#bookCompiler",
  data: {
    book: {
      title: 'Example Title',
      subtitle: 'Example subtitle',
      introduction: 'Example intro'
    },
  	workshop: {
      programDirector: 'Example Director',
    	location: {
        name: 'Example Location',
        description: 'Example description'
      }
    },
    students: [
    	{
    		name: 'Frank Matranga',
        bio: 'is a cool coder.',
        story: {
        	title: 'My Amazing Story',
          body: 'I haven\'t written it yet!'
        },
        imageName: ''
    	}
    ]
  },
  methods: {
  	addStudent: function(event){
      const name = event.target.value;
      if (this.students.filter(s => s.name === name).length > 0) return;
      
    	this.students.push({
      	name: event.target.value,
        bio: '',
        story: {
        	title: '',
          body: ''
        },
        imageName: event.target.value
      });
      event.target.value = '';
    },
    removeStudent: function(student) {
    	this.students = this.students.filter(s => s.name !== student.name);
    },
    setPicture: function(event, student) {
      const file = event.target.files[0];
      student.imageName = student.name.replace(/ /g, '_') + '.' + file.name.split('.')[1];
      console.log(JSON.stringify(file));
      var fd = new FormData();
      fd.append('file',file);

      $.ajax({
          url: '/picture?studentName=' + student.name.replace(/ /g, '_'),
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: function(response){
              alert('uploaded photo')
          },
      });
    },
    generate: function(event) {
    	const data = {
        book: this.book,
      	workshop: this.workshop,
        students: this.students
      }
      console.log(data);
      $.ajax({
        type: "POST",
        url: '/generate',
        data: JSON.stringify(data),
        success: (data) => {
          window.location.href = data.path;
        },
        contentType: 'application/json; charset=utf-8',
      });

    }
  },
  computed: {
    
  }
})