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
                        sh 'docker compose up -d --build'
                    } else {
                        bat 'docker-compose up -d --build'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                    } else {
                        bat 'docker-compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
                    }
                }
            }
        }

        stage('Collect Coverage') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker cp $(docker compose ps -q backend):/app/htmlcov ./htmlcov'
                    } else {
                        // Fix for Windows: two separate commands instead of $() substitution
                        bat '''
                            FOR /F "tokens=*" %%i IN ('docker-compose ps -q backend') DO (
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
                    sh 'docker compose down -v'
                } else {
                    bat 'docker-compose down -v'
                }
            }
        }
    }

}

