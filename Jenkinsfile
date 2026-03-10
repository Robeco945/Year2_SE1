pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Start Environment') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker-compose -p ci up -d --build'
                    } else {
                        bat 'docker-compose -p ci up -d --build'
                    }
                }
            }
    }

        stage('Run Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker-compose -p ci exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                    } else {
                        bat 'docker-compose -p ci exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                    }
                }
            }
        }

        stage('Collect Coverage') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker cp $(docker-compose -p ci ps -q backend):/app/htmlcov ./htmlcov'
                    } else {
                        bat '''
                            FOR /F "tokens=*" %%i IN ('docker-compose -p ci ps -q backend') DO (
                                docker cp %%i:/app/htmlcov ./htmlcov
                            )
                        '''
                    }
                }
            }
        }

        stage('Archive Coverage') {
            steps {
                archiveArtifacts artifacts: 'htmlcov/**', fingerprint: true
            }
        }

    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker-compose -p ci down -v'
                } else {
                    bat 'docker-compose -p ci down -v'
                }
            }
        }
    }
}