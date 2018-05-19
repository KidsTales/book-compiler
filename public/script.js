new Vue({
  el: "#bookCompiler",
  data: {
    book: {
      title: '',
      introduction: ''
    },
    workshop: {
      programDirector: '',
      teachers: [],
      location: {
        name: '',
        description: '',
        locationImage: ''
      }
    },
    students: [

    ]
  },
  methods: {
    addStudent: function (event) {
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
    removeStudent: function (student) {
      this.students = this.students.filter(s => s.name !== student.name);
    },
    addTeacher: function (event) {
      const teacher = event.target.value;
      if (this.workshop.teachers.filter(t => t === teacher).length > 0) return;
      this.workshop.teachers.push(teacher);
      event.target.value = '';
    },
    setPicture: function (event, student) {
      const file = event.target.files[0];
      student.imageName = student.name.replace(/ /g, '_') + '.' + file.name.split('.')[1];
      console.log(JSON.stringify(file));
      var fd = new FormData();
      fd.append('file', file);

      $.ajax({
        url: '/picture?studentName=' + student.name.replace(/ /g, '_'),
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function (response) {},
      });
    },
    setLocationPicture: function (event) {
      const file = event.target.files[0];
      const fileName = this.workshop.location.name.replace(/ /g, '_') + '.' + file.name.split('.')[1];

      this.workshop.location.locationImage = 'pictures/' + fileName;

      var fd = new FormData();
      fd.append('file', file);

      $.ajax({
        url: '/picture?fileName=' + fileName,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function (response) {},
      });
    },
    generate: function (event) {
      if (this.workshop.location.locationImage == '') return alert('You must add at least 1 student!');
      if (this.students.length == 0) return alert('You must add at least 1 student!');

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