new Vue({
  el: "#bookCompiler",
  data: {
    book: {
      title: '',
      subtitle: '',
      introduction: ''
    },
  	workshop: {
    	location: {
        name: '',
        description: ''
      }
    },
    teachers: [],
    students: [
    	{
    		name: 'Frank Matranga',
        bio: 'is a cool coder.',
        story: {
        	title: 'My Amazing Story',
          body: 'I haven\'t written it yet!'
        }
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
        }
      });
      event.target.value = '';
    },
    removeStudent: function(student) {
    	this.students = this.students.filter(s => s.name !== student.name);
    },
    addTeacher: function(event) {
    	const name = event.target.value;

      if (this.teachers.filter(t => t === name).length > 0) return;

      this.teachers.push(event.target.value);
      event.target.value = '';
    },
    removeTeacher: function(teacher) {
    	this.teachers = this.teachers.filter(t => t !== teacher);
    },
    generate: function(event) {
    	const data = {
        book: this.book,
      	workshop: this.workshop,
        teachers: this.teachers,
        students: this.students
      }
      
      $.ajax({
        type: "POST",
        url: '/generate',
        data: JSON.stringify(data),
        success: (data) => {
          alert("sad");
          window.location.href = data.path;
        },
        contentType: 'application/json; charset=utf-8',
      });

    }
  },
  computed: {
    rawD: function() {
      return JSON.stringify({
        book: this.book,
        workshop: this.workshop,
        teachers: this.teachers,
        students: this.students
      });
    }
  }
})