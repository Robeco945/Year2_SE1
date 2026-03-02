pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("messaging-backend-ci")
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image("messaging-backend-ci").inside {
                        sh 'pytest --cov=. --cov-report=html --cov-report=xml --junitxml=pytest.xml'
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
}