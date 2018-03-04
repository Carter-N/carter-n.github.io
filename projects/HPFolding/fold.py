import json
import sys
from multiprocessing import Process, Queue 
import time
import math
import random
"""
class EvolutionaryOptimizer:
        def __init__(self, mutation_rate, population_size, n):
                self.mutation_rate = mutation_rate
                self.population_size = population_size
                self.n = n
                currentPopulation = Population(population_size)

        def begin_optimization(self):
                for i in range(0, self.n):


class Population:
        def __init__(self, size):
                self.population = []
                self.size = size
"""
#Abstract lattice class to store and acsess multi dimension data
class Lattice:
        def __init__(self, n, m):
                self.n = n
                self.m = m
                self.lattice = [["O" for i in range(self.m)] for j in range(self.n)]

        def in_bounds(self, x, y):
                if x >= 0 and x < self.n and y >= 0 and y < self.m:
                        return True
                else:
                        return False 

        def set(self, x, y, a):
                self.lattice[x][y] = a

        def get(self, x, y):
                if self.in_bounds(x, y):
                        return self.lattice[x][y]

        def print_lattice(self, protein):
                for i in range(self.n * 2):
                        currentLine = ""
                        
                        for j in range(self.m * 2):
                                if i % 2 == 0 and j % 2 == 0:
                                        molecule = self.get(math.floor(i / 2), math.floor(j / 2)) 

                                        if molecule == "H" or molecule == "P":
                                                currentLine += molecule
                                        else:
                                                currentLine += " "
                                else:
                                        currentLine += " "

                        print(currentLine)

class Protein:
        def __init__(self, seq):
                self.seq = seq
                self.l = len(self.seq)
                self.foldSeq = []
                self.conformation = []
                self.projection = None
                self.covalenceMatrix = None        

        #TODO make conformation a seperate class
        #TODO make conformation validation a check sum
        def validate_conformation(self):
                d = {}
                for i in range(len(self.conformation)):
                        
                        key = str(self.conformation[i][0]) + "," + str(self.conformation[i][1])
                        if key in d:
                                return False

                        d[key] = 0
                return True
                        
        def random_fold(self):
                foldSeq = []
                for i in range(self.l - 1):
                        foldSeq.append(random.randint(-1, 1))

                return foldSeq
                
        def cardinal(self, x, y):
                if x == 0 and y == 1:
                        return "n"
                if x == 0 and y == -1:
                        return "s"
                if x == 1 and y == 0:
                        return "e"
                if x == -1 and y == 0:
                        return "w"

        def direction(self, cardinal):
                if cardinal == "n":
                        return [0, 1]
                if cardinal == "s":
                        return [0, -1]
                if cardinal == "e":
                        return [1, 0]
                if cardinal == "w":
                        return [-1, 0]
                
        def bond_exsists(self, x, y, dx, dy):
                cardinal = self.cardinal(dx, dy)
                molecule = self.covalenceMatrix.get(x, y)
                if cardinal in molecule:
                        return True 

                return False 
                
        #TODO Vector class
        def conform(self):
                self.conformation = []
                
                currentX = 0
                currentY = 0

                currentDirX = 1
                currentDirY = 0

                self.covalenceMatrix = Lattice(self.l * 2, self.l * 2)

                for i in range(self.l):

                        #Add the current position in the center of the matrix
                        self.conformation.append([currentX, currentY])
                        
                        #Initialize covalent bond
                        self.covalenceMatrix.lattice[self.l + currentX][self.l + currentY] = [] 

                        #Add covalent bond to next molecule if not last in protein 
                        if i > 0:
                                self.covalenceMatrix.lattice[self.l + currentX][self.l + currentY].append(self.cardinal(-currentDirX, -currentDirY))

                        tempX = currentDirX
                        tempY = currentDirY

                        #Rotation left (270 degrees)
                        if self.foldSeq[i - 1] == -1:
                                
                                currentDirX = -tempY
                                currentDirY = tempX 

                        #Rotation right (90 degrees)
                        elif self.foldSeq[i - 1] == 1:

                                currentDirX = tempY 
                                currentDirY = -tempX

                        #Add covalent bond to next molecule
                        if i < self.l - 1:
                                self.covalenceMatrix.lattice[self.l + currentX][self.l + currentY].append(self.cardinal(currentDirX, currentDirY))

                        currentX += currentDirX
                        currentY += currentDirY

        #Possible problem here when getting bonds out of bounds 
        def fitness(self):
                score = 0
                for i in range(self.lattice.n):
                        for j in range(self.lattice.m):
                            if self.lattice.get(i, j) == "H": 
                                    if self.lattice.get(i + 1, j) == "H" and not self.bond_exsists(i, j, 1, 0):
                                            score += 1
                                    if self.lattice.get(i - 1, j) == "H" and not self.bond_exsists(i, j, -1, 0):
                                            score += 1
                                    if self.lattice.get(i, j + 1) == "H" and not self.bond_exsists(i, j, 0, 1):
                                            score += 1
                                    if self.lattice.get(i, j - 1) == "H" and not self.bond_exsists(i, j, 0, -1):
                                            score += 1

                return score

        #TODO Calculate bounding box and project into it (with margin)
        def projectToLattice(self):

                lattice = Lattice(self.l * 2, self.l * 2)
                centerX = self.l 
                centerY = self.l 

                for i in range(len(self.conformation)):
                        lattice.set(centerX + self.conformation[i][0], centerY + self.conformation[i][1], self.seq[i])

                return lattice

#Generate a random valid protein from a sequence
def random_valid_protein(seq):

        #Initial acid sequence   
        protein = Protein(seq)

        #Naive conformation generation
        while len(protein.foldSeq) == 0 or not protein.validate_conformation():
                protein.foldSeq = protein.random_fold()
                protein.conform()

        protein.lattice = protein.projectToLattice()
        return {
                "protein": protein,
                "fitness": protein.fitness()
        }

#Assign a process task to fold a certain number of protiens
def foldingTask(n, e, seq, q, id):
        
        #Process time keeping
        start = time.time()
        firstStart = start

        #Current best candidate
        best = random_valid_protein(seq) 

        for i in range(n):

                #Epoch reached
                if i % e == 0 and i > 0:

                        end = time.time()
                        print("[PROCESS {0} EPOCH REACHED] {1} proteins evaluated, best fitness: {2}, SPS: {3}".format(id, i, best["fitness"], math.floor(e / (end - start))))
                        start = end

                new = random_valid_protein(seq)                 
                if new["fitness"] > best["fitness"]:
                        best = new

        #Print statistics of simulation
        print("Process {0} finished STATS:".format(id))
        print("{0} random structures evaluated after {1:.2f} epochs...".format(n, n / e))
        print("SPS: {0:.2f}".format(n / (end - firstStart)))
        print("Total time (seconds): " + str(math.floor(end - firstStart)))
        print("Fitness: " + str(best["fitness"]))

        q.put(best)

def getBestResults(results):
        best = results[0]
        for i in range(1, len(results)):
                if best["fitness"] < results[i]["fitness"]:
                        best = results[i]

        return best

#Processing pool
if __name__ == '__main__':

        #Get command line argumnents
        #N number of iterations
        #E epoch
        #Seq initial residue sequence
        #Np number of threads/processes
        n = int(sys.argv[1])
        e = int(sys.argv[2])
        seq = sys.argv[3]
        np = int(sys.argv[4])

        #Begin folding task message
        print("Evaluating {0} random protein structures with sequence {1}...".format(n, seq))
        print("Epoch set to {0}...".format(e))
        print("{0} processes spawned...".format(np))

        #Task data 
        start = time.time() 
        q = Queue()
        results = []

        #Processes
        processes = []

        #Spawn processes
        for i in range(np):
                p = Process(target = foldingTask, args=(n // np, e // np, seq, q, i)) 
                processes.append(p)
                p.start()
        
        #End processes and collect results
        for j in range(np):
                results.append(q.get(True))

        for k in range(np):
                processes[k].join()

        print("Folding process finished, total time: {0:.2f}s".format(time.time() - start))
        best = getBestResults(results)
        print("Best fitness: " + str(best["fitness"]))         
        best["protein"].lattice.print_lattice(best["protein"])
