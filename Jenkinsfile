pipeline {
  agent {
    node 'mac'
    //dockerfile {
      //filename 'Dockerfile'
      //label 'mac'
    //}
  }
  stages {
    stage('Analyse') {
      steps {
        sh(returnStatus: true, script: 'cppcheck ./backend --xml --std=c++17 --suppressions-list=suppressions.txt  2> cppcheck-result.xml')
        publishCppcheck(allowNoReport: true, ignoreBlankFiles: true, pattern: '**/cppcheck-result.xml')
      }
    }

    //stage('build') {

      //steps {
        //dir(path: './backend') {
          //sh 'cmake .'
          //sh 'make'
        //}

      //}
    //}

    //stage('ctest') {
      //steps {
        //dir(path: './backend') {
          //sh 'ctest'
        //}

      //}
    //}

  }

}
