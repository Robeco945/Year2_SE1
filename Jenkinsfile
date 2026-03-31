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
                bat 'docker-compose up -d --build'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'docker-compose exec backend pytest --cov=. --cov-report=xml --cov-report=html --junitxml=pytest.xml'
            }
        }

	stage('Collect Coverage') {
    	    steps {
        	bat 'docker cp $(docker-compose ps -q backend):/app/htmlcov ./htmlcov'
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
            bat 'docker-compose down -v'
        }
    }

}
